/* eslint-disable func-names */
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
import { CommentsTable } from '../../../components/Main/Tables/Comments';
import { InputSearch } from '../../../components/Forms/components/InputSearch';
import { queryClient } from '../../../services/queryClient';
import { useSearchClients } from '../../../services/hooks/get/useSearchClients';
import { IUser } from '../../../types/types';
import {
  formatCPFeCNPJeCEPeCNAE,
  keepOnlyNumbers,
} from '../../../helpers/StringHandle';

interface IResponse {
  msg: string;
  created_at: number;
}

interface IMessage {
  msg: string;
  name: string;
  email: string;
  cursoName: string;
  cursoId: string;
  photoURL: string;
  uid: string;
  response: IResponse | boolean;
  classId: string;
  moduleId: string;
  id: string;
  created_at: number;
}

const Comments: React.FC = () => {
  const { setLoaderDash } = useLoaderDashboard();
  const formRef = useRef<FormHandles>(null);
  const notification = useNotification();
  const { currentUser } = useAuth();
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const chatRef = db.collection('notifications').doc('activeUsers');
  const commentsRef = db.collection('comments');

  const { data, isLoading } = useQuery<IMessage[]>(
    'comments_to_respond',
    async () => {
      const query: any = await commentsRef.where('response', '==', false).get();
      const array: IMessage[] = [];
      query.forEach(function (doc: any) {
        array.push({ ...(doc.data() as IMessage) });
      });
      return array;
    },
    {
      staleTime: 1000 * 60, // 60s
      refetchOnWindowFocus: 'always',
    },
  );

  useEffect(() => {
    setLoaderDash(false);
  }, []);

  const handleChatOpen = (message: IMessage): void => {
    history.push(
      `/app/admin/video/${message.cursoId}/${message.moduleId}/${message.classId}`,
    );
  };

  return (
    <>
      <ChatContainer>
        <HeaderComponent
          title="Comentários sem resposta"
          subTitle={['comentários']}
          icon={<ChatIcon />}
        />
        {data && (
          <>
            <TableTitle>Ultimas conversas</TableTitle>
            <CommentsTable
              data={data ?? []}
              isLoading={isLoading}
              onClickRow={handleChatOpen}
            />
          </>
        )}
      </ChatContainer>
      <div style={{ display: userId ? 'flex' : 'none' }}>
        <WidgetComponent />
      </div>
    </>
  );
};

export default Comments;
