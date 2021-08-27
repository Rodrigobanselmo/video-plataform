/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, FormHandles } from '@unform/core';
import * as Yup from 'yup';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import { toggleWidget, deleteMessages } from 'react-chat-widget';
import { useHistory, useParams } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { useAuth } from '../../../context/AuthContext';
import {
  InputEnd,
  InputUnform,
} from '../../../components/Main/MuiHelpers/Input';
import { ChatContainer, InputContainer } from './styles';
import { ButtonForm } from '../../../components/Dashboard/Components/Form/comp';
import { db } from '../../../lib/firebase.prod';
import { HeaderComponent } from '../../../components/Blocks/Header';
import { WidgetComponent } from '../../../components/Widget/admin';

const Chat: React.FC = () => {
  const { setLoaderDash } = useLoaderDashboard();
  const formRef = useRef<FormHandles>(null);
  const notification = useNotification();
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>({});
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();

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
    console.log(uid);
    history.push(`/app/admin/chats/${uid}`);
  };

  return (
    <>
      <ChatContainer>
        <HeaderComponent
          title="Área de Chats"
          subTitle={['chats']}
          icon={<ChatIcon />}
        />
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
