import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase.prod';
import { useHistory, useLocation } from 'react-router-dom';
import { CLIENT_ADMIN, DASHBOARD, SIGN } from '../routes/routesNames';
import { useNotification } from './NotificationContext';
import { useLoaderDashboard } from './LoadDashContext';
import { useLoaderScreen } from './LoaderContext';
import { GetUserData } from '../services/firestoreUser';
import { LogOut } from '../services/firebaseAuth';
import { useMutation } from 'react-query';
import { useCreateUser } from '../services/hooks/set/useCreateUser';
import { useUserHistory } from '../services/hooks/set/useUserHistory';
import Arrow from '@material-ui/icons/KeyboardArrowRight';
import styled from 'styled-components';

const IconArrow = styled(Arrow)`
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

const CurrentUserButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  background-image: linear-gradient(
    -10deg,
    ${({ theme }) => theme.palette.primary.main},
    ${({ theme }) => theme.palette.primary.light}
  );
  border-radius: 50px;
  padding: 10px 20px 10px 20px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: bold;
  border: none;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
  }

  &:hover {
    filter: brightness(0.9);
  }
`;

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState('');
  const [oldUser, setOldUser] = useState('');
  const mutation = useCreateUser(setCurrentUser);
  const mutationHistory = useUserHistory(setCurrentUser);
  const history = useHistory();

  const { setLoaderDash } = useLoaderDashboard();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(user);
        setLoaderDash(false);
      }
      if (user) {
        const userData = await mutation.mutateAsync(user);
        mutationHistory.mutate({ user: userData, type: 'online' });
      }
    });

    return unsubscribe;
  }, []);

  const BackUser = () => {
    setCurrentUser(oldUser);
    history.push(CLIENT_ADMIN);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, setOldUser, oldUser }}
    >
      {currentUser !== '' && children}
      {currentUser?.manager && (
        <CurrentUserButton onClick={BackUser}>
          Voltar
          <IconArrow />
          {oldUser?.name && <span>{oldUser.name} </span>}
        </CurrentUserButton>
      )}
    </AuthContext.Provider>
  );
}

/*     notification.modal({
      title:'Usuário Adicionado',
      text:'Um email de autenticação foi enviado aos usuários para se tornarem membros de sua equipe.',
      type:'inform',
      rightBnt:'OK',
      open:true,
    }) */
