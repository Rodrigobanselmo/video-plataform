import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { DateProvider } from '../../../../helpers/DateProvider/implementation';
import { db, fb } from '../../../../lib/firebase.prod';
import { queryClient } from '../../../../services/queryClient';
import { AvatarView } from '../../Avatar';
import { InputEnd } from '../../MuiHelpers/Input';
import { ModalButtons } from '../../MuiHelpers/ModalButtons';

const EditMessage = styled.div`
  display: inline-flex;
  width: 100%;
  button {
    margin: 2px 5px;
    padding: 2px 5px;
  }
  button:first-child {
    margin-left: auto;
  }
`;

export const TextStyledArea = styled.p`
  width: 100%;
  padding: 0.5rem 0.5rem 0.8rem 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.background.secondary};
  box-sizing: border-box;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.palette.background.line};
  margin: 0 0 10px 0;
  border-radius: 6px;
  margin-left: 10px;

  > div {
    display: flex;
    > p {
      opacity: 0.7;
      font-size: 0.8rem;
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
    }
    p.date {
      display: inline-block;
      margin-left: auto;
    }
  }

  @media screen and (max-width: 1100px) {
    margin-left: 0px;
  }
`;

export function TextComment({
  isResponse,
  data,
  mb,
  hasResponse,
  isAdmin,
  isYourMessage,
}) {
  const [open, setOpen] = useState(false);
  const notification = useNotification();
  const [response, setResponse] = useState();
  const commentsRef = db.collection('comments');

  async function onConfirmResponse() {
    if (!response) return setOpen(false);
    try {
      await commentsRef.doc(data.id).update({
        response: {
          msg: response,
          created_at: new Date().getTime(),
        },
      });
      queryClient.refetchQueries('comments');
    } catch (e) {
      notification.error({ message: 'Falha ao responser' });
    }
    setOpen(false);
  }

  function onOpen() {
    setOpen(true);
    setResponse(data?.response ? data.response?.msg : '');
  }

  function onCloseModal() {
    setOpen(false);
  }
  async function onDelete(isToDelete) {
    if (!isToDelete)
      return notification.modal({
        title: 'Você tem certeza?',
        type: 'inform',
        text:
          'Você tem certeza que deseja deletar permanentemente está menssagem?',
        open: true,
        rightBnt: 'Deletar',
        onClick: () => onDelete(true),
      });
    try {
      await commentsRef.doc(data.id).delete();
      queryClient.refetchQueries('comments');
      notification.success({ message: 'Comentário deletado com sucesso' });
    } catch (e) {
      notification.error({ message: 'Falha ao deletar' });
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        marginLeft: isResponse ? 60 : 0,
        marginBottom: mb,
      }}
    >
      <AvatarView
        onClick={() => {}}
        navbar
        style={{ marginLeft: 0 }}
        randomColor
        user={data}
      />
      <div style={{ width: '100%' }}>
        <TextStyledArea>
          <div>
            <p style={{ width: '100%' }}>
              {isResponse ? '@suporte' : data.name}
            </p>
            <p className="date">
              {Intl.DateTimeFormat('pt-BR', {}).format(data?.created_at)}
            </p>
          </div>
          {data.msg}
        </TextStyledArea>
        {(isAdmin || isYourMessage) && (
          <EditMessage style={{ marginBottom: hasResponse ? 10 : 0 }}>
            {isAdmin && <button onClick={() => onOpen()}>responser</button>}
            <button onClick={() => onDelete()}>deletar</button>
          </EditMessage>
        )}
      </div>
      {isAdmin && open && (
        <ModalButtons
          open={Boolean(open)}
          disable={false}
          onClick={onConfirmResponse}
          onClose={onCloseModal}
          title={`Responser ${data.name}`}
        >
          <InputEnd
            labelWidth={220}
            label="Escreva sua resposata aqui..."
            width={'100%'}
            variant="outlined"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </ModalButtons>
      )}
    </div>
  );
}
