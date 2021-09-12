/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import NoteIcon from '@material-ui/icons/Note';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { ChatContainer, TableTitle, Item } from './styles';
import { db } from '../../../lib/firebase.prod';
import { HeaderComponent } from '../../../components/Blocks/Header';
import { CertificationTable } from '../../../components/Main/Tables/Certification';

interface IUserChat {
  userId: string;
  name: string;
  photoURL: string;
  email: string;
  created_at: number;
}

interface ICertification {
  email: string;
  name: string;
  validSignature: string;
  fileURL: string;
  userId: string;
  studentId: string;
  cursoName: string;
  finishedDate: string;
  id: string;
}
const Certification: React.FC = () => {
  const { setLoaderDash } = useLoaderDashboard();
  const { userId } = useParams<{ userId: string }>();
  const certificationRef = db.collection('certifications');

  const { data: certificationsArray, isLoading } = useQuery<ICertification[]>(
    'certifications',
    async () => {
      console.log('reload data');

      const response = await certificationRef
        .where('fileURL', '==', false)
        .where('validSignature', '==', true)
        .get();

      const certifications: ICertification[] = [];

      response.forEach(function (doc) {
        certifications.push({ ...(doc.data() as ICertification) });
      });

      return certifications;
    },
    {
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setLoaderDash(false);
  }, [userId]);

  const handleChatOpen = (uid: string): void => {
    console.log(`handleChatOpen`);
  };

  return (
    <>
      <ChatContainer>
        <HeaderComponent
          title="Assinar Certificados"
          subTitle={['certificados']}
          icon={<NoteIcon />}
        />
        {/* <TableTitle>Procurar Aluno</TableTitle> */}
        {certificationsArray && (
          <>
            <TableTitle>Certificados Pendentes de Assinatura</TableTitle>
            <CertificationTable
              data={certificationsArray ?? []}
              isLoading={isLoading}
              onClickRow={handleChatOpen}
            />
          </>
        )}
        {/* {activeUsers?.answer && (
          <>
            <TableTitle>Ultimas conversas</TableTitle>
            <CertificationTable
              data={activeUsers?.answer ?? []}
              isLoading={isLoading}
              onClickRow={handleChatOpen}
            />
          </>
        )} */}
      </ChatContainer>
    </>
  );
};

export default Certification;
