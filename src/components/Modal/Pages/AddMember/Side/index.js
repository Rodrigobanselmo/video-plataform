/* eslint-disable react/jsx-curly-newline */
import React from 'react';
// import AddModal, {Type,Form} from './comp'
// import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { useAuth } from '../../../../../context/AuthContext';
import { InputEnd } from '../../../../Main/MuiHelpers/Input';
import { NumberFormatCPF } from '../../../../../lib/textMask';
import { AscendentObject } from '../../../../../helpers/Sort';
import { SIGN } from '../../../../../routes/routesNames';
import { useNotification } from '../../../../../context/NotificationContext';
import { queryClient } from '../../../../../services/queryClient';
import { BootstrapTooltip } from '../../../../Main/MuiHelpers/Tooltip';
import { PERMISSIONS } from '../../../../../constants/geral';
import { UserInfoInputs } from './UserInfo';
import { PermissionSelect } from './Permission';
import { CursosSideBar } from './Cursos';
import { CursosSideBarAdmin } from './CursosAdmin';

const TitleSection = styled.h3`
  color:${({ theme }) => theme.palette.text.primary};
  font-size:${({ isAddClient }) => isAddClient? 22:16}px;
  margin:${({ isAddClient }) => isAddClient? '0 0 0 0':'20px 0 0px 0'};
`;

const EpiView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};
  cursor: pointer;

  &:hover {
    opacity: 0.6;
    background-color: #55555509;
  }

  p {
    padding-right: 20px;
    width: 100%;
  }

  &.group {
    padding-top:20px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
    margin-bottom:1px;
    padding-bottom:5px;
    p {
      color:${({ theme }) => theme.palette.text.secondary};
      font-size:13px;
    }
  }

  &.last {
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
  }
`;

const Check = styled(Checkbox)`
  height: 35px;
  width: 35px;
`;

const ItemCurso = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 5fr 35px;
  grid-template-rows: 1fr fit-content;
  grid-gap: 0 10px;
  margin-top: 10px;
  padding: 7px 0;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};

  div.image {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    background-image: url('${({ image }) => image}');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius:5px;
  }

  div.checkbox {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    align-self: center;
    height: 35px;
    width: 35px;
  }

  h1 {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const SideEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  overflow-y: auto;
  max-height: 85vh;
  border-radius: 20px;
  width:100%;
  @media screen and (max-width: 800px) {
    grid-area:side;
  }
  div.selected {
    display: flex;
    flex-direction: column;
    width: 100%;

    > h2 {
      font-size: 1.3rem;
      color: ${({ theme }) => theme.palette.text.primary};
      margin-bottom: ${({ isUrl }) => (isUrl ? 10 : 0)}px;
    }
    > p {
      font-size: 1rem;
      color: ${({ theme }) => theme.palette.text.primary};
      margin-bottom: 10px;
    }
  }

  .none {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export function SideEmail({ email, data, setData, setCursos, cursos, setPermissions, permissions, isAddClient }) {

  const { currentUser } = useAuth();

  const isAdmin = currentUser?.access === 'admin'
  const isUrl = email.value && email.value.includes(SIGN);


  return (
    <SideEmailContainer isUrl={isUrl}>
      {email?.value ? (
        <div className="selected">
        <UserInfoInputs
          isUrl={isUrl}
          email={email}
          data={data}
          setData={setData}
        />
        {!isAddClient && <PermissionSelect
          email={email}
          setPermissions={setPermissions}
          permissions={permissions}
          isAdmin={isAdmin}
          isAddClient={isAddClient}
        />}
          {isAdmin && (
            <TitleSection isAddClient={isAddClient}>Cursos</TitleSection>
          )}
          {isAddClient && isAdmin ? (
            <CursosSideBarAdmin
              email={email}
              isAdmin={isAdmin}
              setCursos={setCursos}
              cursos={cursos}
              setPermissions={setPermissions}
              permissions={permissions}
            />
          ) : (
            <CursosSideBar
              email={email}
              isAdmin={isAdmin}
              setCursos={setCursos}
              cursos={cursos}
              setPermissions={setPermissions}
              permissions={permissions}
            />
          )}
        </div>
      ) : (
        <p className="none">
          Nenhum email <br /> selecionado
        </p>
      )}
    </SideEmailContainer>
  );
}
