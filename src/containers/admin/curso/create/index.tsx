/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
// import Modal from './Modal'
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import * as Yup from 'yup';
import HeaderProfile from '../../../../components/Dashboard/Components/Blocks/HeaderProfile';
import { useNotification } from '../../../../context/NotificationContext';
import { useAuth } from '../../../../context/AuthContext';
import { useLoaderScreen } from '../../../../context/LoaderContext';
import { useLoaderDashboard } from '../../../../context/LoadDashContext';
import { ProfilePrimaryUserData } from '../../../../components/Containers/Profile/ProfilePrimaryUserData';
import { ProfileHistory } from '../../../../components/Containers/Profile/ProfileHistory';
import { DraftWrite } from '../../../../components/Draft/DraftWrite';
import { HeaderComponent } from '../../../../components/Blocks/Header';
import { HeaderBlock } from '../../../../components/Molecules/HeaderBlock';
import { InputFile } from '../../../../components/Forms/components/InputFile';
import { InputUnform } from '../../../../components/Main/MuiHelpers/Input.js';
import { NumberOnly } from '../../../../lib/textMask';
import { CursoAddData } from '../../../../components/Forms/CursoAddData';
import { ButtonForm } from '../../../../components/Dashboard/Components/Form/comp';

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

interface IUser {
  currentUser: {
    uid: string;
    name: string;
  };
}

const Team: React.FC = () => {
  const { currentUser }: IUser = useAuth();
  // const [user, setUser] = useState(false)

  // const notification = useNotification()
  // const query = new URLSearchParams(useLocation().search)
  const { setLoaderDash } = useLoaderDashboard();

  useEffect(() => {
    setLoaderDash(false);
  }, [setLoaderDash]); // query,

  const onSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    console.log(event.target);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <HeaderComponent
          title="Cadastrar Novo Curso"
          subTitle={['admin', 'cursos', 'created']}
          icon={<ScreenShareIcon />}
          video
        />
        <InputFile />
        <ButtonForm
          style={{ marginBottom: '10px', minWidth: 100 }}
          primary
          type="submit"
          loading={false}
          // justify="right"
        >
          Salvar
        </ButtonForm>
        <CursoAddData />
        <HeaderBlock
          title="Público Alvo"
          text="Aqui você deve inserir quem é o público alvo do curso"
        />
        <DraftWrite
          size="xs"
          initialEditorState={null}
          onSave={(value) => console.log('value', value)}
          autoSave
        />
        <HeaderBlock
          title="Sobre o curso"
          text="Aqui você deve inserir as principais informações sobre o curso"
          mt={2}
        />
        <DraftWrite
          size="s"
          allVisible
          initialEditorState={null}
          onSave={(value) => console.log('value', value)}
          autoSave
        />
      </form>
    </Container>
  );
};

export default Team;
