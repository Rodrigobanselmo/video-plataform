import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { db, fb } from '../../../lib/firebase.prod';
import { AvatarView } from '../Avatar';
import { Comment } from './comment';
import { TextComment } from './text';

const Button = styled.button`
  padding: 5px 0.8rem;
  border: none;
  background-color: ${({ theme }) => theme.palette.primary.light};
  font-weight: bold;
  font-size: 1rem;
  border-radius: 5px;
  color: white;
  align-self: flex-end;
  margin-top: -10px;
`;

export function Comments({ curso }) {
  const { currentUser } = useAuth();
  const ref = useRef(null);
  const [data, setData] = useState([]);
  const chatRef = db
    .collection('curso')
    .doc(curso?.id)
    .collection('notifications')
    .doc('chat');
  useEffect(() => {
    const getData = async () => {
      const data = await chatRef.get();
      if (data.exists) {
        setData(data.data().data);
      }
    };
    getData();
  });

  const onSendMessage = () => {
    ref.current.onSendMessage();
    if (ref.current.data.msg) setData((dt) => [ref.current.data, ...dt]);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Comentários e Dúvidas</h2>
      <Comment textRef={ref} curso={curso} />
      <Button onClick={onSendMessage}>Enviar</Button>
      <p style={{ margin: '1rem 0' }}>últimos comentários</p>
      {data.map((item, index) => {
        return (
          <>
            <TextComment mb={item?.response ? 0 : 20} data={item} />
            {item?.response && (
              <TextComment
                mb={20}
                isResponse
                data={{
                  msg: item?.response,
                  name: 'support',
                  photoURL: '/images/iconRealiza.png',
                }}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
