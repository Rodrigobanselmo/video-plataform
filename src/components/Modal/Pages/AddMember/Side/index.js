/* eslint-disable react/jsx-curly-newline */
import React, {useMemo} from 'react';
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
import { fade } from '@material-ui/core/styles';
import { useSellingData } from '../../../../../context/data/SellingContext';
import { CompanyInfoInputs } from './CompanyInfo';

const PriceText = styled.strong`
  margin:10px 0 10px 0;
  padding:5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  width: fit-content;
  /* background-color: ${({ theme }) => fade(theme.palette.primary.greyRealiza,1)}; */
  background-color: #000000aa;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  span {
    margin-left:10px;
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

export function SideEmail({ isNewClient }) {

  const { currentUser } = useAuth();

  const { fieldEdit, dataUser, setDataUser, prices, setPermissions, permissions, isBilling } = useSellingData()
  const fieldIndex = fieldEdit?.index

  const isAdmin = currentUser?.access === 'admin'
  const isUrl = fieldEdit.value && fieldEdit.value.includes(SIGN);
  const isCNPJ =  permissions[(`${fieldIndex}--co`)]

  const price = prices[fieldIndex]
  // const price = isBilling ? prices[fieldIndex] : 0

  return (
    <SideEmailContainer isUrl={isUrl}>
      {fieldEdit?.value ? (
        <div className="selected">
        {!isCNPJ ? (
          <UserInfoInputs
            isUrl={isUrl}
            fieldEdit={fieldEdit}
            dataUser={dataUser}
            setDataUser={setDataUser}
          />
        ) : (
          <CompanyInfoInputs
            isUrl={isUrl}
            fieldEdit={fieldEdit}
            dataUser={dataUser}
            setDataUser={setDataUser}
          />
        )}
        {isAdmin && <PermissionSelect
          fieldEdit={fieldEdit}
          setPermissions={setPermissions}
          permissions={permissions}
          isNewClient={isNewClient}
        />}
          {/* {isAdmin && (
            <TitleSection isAddClient={isAddClient}>Cursos</TitleSection>
          )} */}

            <PriceText>
              Preço:
              <span>
              {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(price?price:0)}
              </span>
            </PriceText>

          {/* {isAddClient && isAdmin ? (
            <CursosSideBarAdmin
              email={fieldEdit}
              isAdmin={isAdmin}
              setCursos={setCursos}
              cursos={cursos}
              setPermissions={setPermissions}
              permissions={permissions}
            />
          ) : ( */}
            <CursosSideBar
              isAdmin={isAdmin}
            />
          {/* )} */}
        </div>
      ) : (
        <p className="none">
          Nenhum email <br /> selecionado
        </p>
      )}
    </SideEmailContainer>
  );
}
