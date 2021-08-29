/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, FormHandles } from '@unform/core';
import * as Yup from 'yup';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import { toggleWidget, deleteMessages } from 'react-chat-widget';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useNotification } from '../../../context/NotificationContext';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { useAuth } from '../../../context/AuthContext';
import {
  InputEnd,
  InputUnform,
} from '../../../components/Main/MuiHelpers/Input';
import { ChatContainer, TableTitle, Item } from './styles';
import { ButtonForm } from '../../../components/Dashboard/Components/Form/comp';
import { db } from '../../../lib/firebase.prod';
import { HeaderComponent } from '../../../components/Blocks/Header';
import { WidgetComponent } from '../../../components/Widget/admin';
import { ChatsTable } from '../../../components/Main/Tables/Chats';
import { InputSearch } from '../../../components/Forms/components/InputSearch';
import { queryClient } from '../../../services/queryClient';
import { useSearchClients } from '../../../services/hooks/get/useSearchClients';
import { IUser } from '../../../types/types';
import {
  formatCPFeCNPJeCEPeCNAE,
  keepOnlyNumbers,
} from '../../../helpers/StringHandle';

interface IUserChat {
  userId: string;
  name: string;
  photoURL: string;
  email: string;
  created_at: number;
}

interface IActiveUsers {
  data: IUserChat[];
  answer: IUserChat[];
}
const Chat: React.FC = () => {
  const { setLoaderDash } = useLoaderDashboard();
  const formRef = useRef<FormHandles>(null);
  const notification = useNotification();
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>({});
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const chatRef = db.collection('notifications').doc('activeUsers');

  const { data: activeUsers, isLoading } = useQuery<IActiveUsers>(
    'chats-active',
    async () => {
      console.log('reload data');
      const chats = await chatRef.get();
      if (!chats.exists) return {} as IActiveUsers;
      return { ...chats.data() } as IActiveUsers;
    },
    {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: 'always',
    },
  );

  useEffect(() => {
    // toggleWidget();
    // const onGetEmails = async (): Promise<void> => {
    //   const emailsNotifications = await db
    //     .collection('notifications')
    //     .doc('active')
    //     .get();

    //   if (emailsNotifications.exists) {
    //     const emailsData = emailsNotifications.data() as any[];
    //     // Object.entries(emailsData).map(([field, email]) => {
    //     //   if (formRef?.current) formRef.current?.setFieldValue(field, email);
    //     // });
    //     setData(emailsData);
    //   }
    // };

    // onGetEmails();

    setLoaderDash(false);
  }, [userId]);

  const handleChatOpen = (uid: string): void => {
    if (window.location.pathname.includes(uid)) {
      toggleWidget();
      return;
    }
    history.push(`/app/admin/chats/${uid}`);
  };

  const mutationSearch = useSearchClients(true);

  async function handleSelect(
    value: IUser,
    onClose: () => void,
  ): Promise<void> {
    console.log(value.uid);
    const chatUserRef = db
      .collection('users')
      .doc(value.uid)
      .collection('notifications')
      .doc('chat');

    const notificationUser = await chatUserRef.get();

    if (!notificationUser.exists) {
      const chatData = {
        missing: 0,
        name: value?.name,
        email: value?.email,
        uid: value?.uid,
        photoURL: value?.photoURL,
        data: [],
      };

      chatUserRef.set(chatData);
    }
    handleChatOpen(value.uid);
    onClose();
  }

  const filter = async (_: any, search: any): Promise<any[]> => {
    // filter with server search
    const newData = (await mutationSearch.mutateAsync(search)) as any[];
    return newData;
  };

  const users = queryClient.getQueryData('clients') as IUser[];
  const options = users
    ? users.filter((i: any) => i?.status && i.status !== 'Pendente')
    : [];

  return (
    <>
      <ChatContainer>
        <HeaderComponent
          title="Área de Chats"
          subTitle={['chats']}
          icon={<ChatIcon />}
        />
        <TableTitle>Procurar Aluno</TableTitle>
        <InputSearch
          style={{ margin: '10px 0 30px 0' }}
          filter={filter}
          onSelectItem={handleSelect}
          row={({ item, ...rest }) => (
            <Item {...rest}>
              <p>{item?.razao || item?.name}</p>
              <p>{item?.email ?? item?.link}</p>
              <p>
                {item?.cnpj
                  ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cnpj))
                  : item?.cpf
                  ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cpf))
                  : '---------------------------'}
              </p>
            </Item>
          )}
          name="selects"
          options={options}
        />
        {activeUsers?.data && (
          <>
            <TableTitle>Conversas em aberto</TableTitle>
            <ChatsTable
              data={activeUsers?.data ?? []}
              isLoading={isLoading}
              onClickRow={handleChatOpen}
            />
          </>
        )}
        {activeUsers?.answer && (
          <>
            <TableTitle>Ultimas conversas</TableTitle>
            <ChatsTable
              data={activeUsers?.answer ?? []}
              isLoading={isLoading}
              onClickRow={handleChatOpen}
            />
          </>
        )}
        <ButtonForm
          onClick={() => handleChatOpen('7qxxF86PE1W1AzK4xzIEB5jLyhE3')}
          type="button"
          primary="true"
          style={{ width: 'fit-content' }}
        >
          Salvar
        </ButtonForm>
      </ChatContainer>
      <div style={{ display: userId ? 'flex' : 'none' }}>
        <WidgetComponent />
      </div>
    </>
  );
};

export default Chat;
