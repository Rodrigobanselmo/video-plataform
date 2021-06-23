import React from 'react';
import { useLocation } from 'react-router-dom';
import {useLoaderScreen} from '../../context/LoaderContext'
import {useNotification} from '../../context/NotificationContext'
import SignIn from '../../components/Main/Sign';
import styled from "styled-components";

const Div = styled.div`
`;

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SignInPage() {

  const query = useQuery()
  const {setLoad} = useLoaderScreen();
  const notification = useNotification();

  React.useEffect(() => {
    setLoad(false)
  }, [])

  function name(params) {
    notification.modal({
      title: 'Você tem certeza?',
      text:'Você possui informações que não estão salvas, tem certeza que deseja sair sem salvar?',
      rightBnt:'Sair',
      open:true,
      onClick:()=>{}
    })
    // notification.success({message:'Usuário criado com sucesso'})
  }

  return (
    <Div>
      <SignIn emailQuery={query.get('email')} />
    </Div>
  );
}

export default SignInPage;

{/* <button onClick={name}>ss</button> */}
