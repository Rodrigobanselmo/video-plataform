import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import styled, { css } from 'styled-components';
import { Icons } from '../../../Icons/iconsDashboard';
import { AvatarView } from '../../Avatar';
import { BootstrapTooltip } from '../../MuiHelpers/Tooltip';
// import { FilterComponent } from '../../Table/comp';
import { LoadMoreTableCells, LoadSkeleton } from '../elements/LoadMore';
import { LoadTable } from '../elements/LoadTable';
import { MissingData } from '../elements/MissingData';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import { FilterComponent } from '../elements/Filter';
import { useDeleteUsers } from '../../../../services/hooks/del/useDeleteUsers';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { IconLoadButton } from '../elements/IconLoadButton';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PERMISSIONS } from '../../../../constants/geral';
import { CollapseTable } from './Collapse';
import { filterObject } from '../../../../helpers/ObjectArray';
import { useSearchClients } from '../../../../services/hooks/get/useSearchClients';
import { useGetMoreClients } from '../../../../services/hooks/get/useGetMoreClients';
import { formatCPFeCNPJeCEPeCNAE } from '../../../../helpers/StringHandle';
import { useAuth } from '../../../../context/AuthContext';
import { useHistory } from 'react-router';
import { PROFILE } from '../../../../routes/routesNames';
import { queryClient } from '../../../../services/queryClient';

const ContainerTable = styled.div`
  padding-right: 54px;

  @media screen and (max-width: 1100px) {
    padding-right: 40px;
  }

  @media screen and (max-width: 700px) {
    padding-right: 20px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: ${(props) => (props.noFilter ? '12px' : '1rem')};
`;

const Table = styled.div`
  min-width: 1100px;
`;

const TableHeader = styled.div`
  display: grid;
  margin-bottom: 10px;
  grid-template-columns:
    minmax(280px, 1.5fr) minmax(200px, 1fr) minmax(200px, 1fr)
    minmax(200px, 1fr);
  padding: 0rem 1.75rem;
  align-items: center;
`;

const TableHComponent = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-weight: 400;
  padding: 0.25rem 0.25rem;
  text-align: left;
  line-height: 1.5rem;
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(280px, 1.5fr) minmax(200px, 1fr) minmax(200px, 1fr)
    minmax(200px, 1fr);
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.palette.background.paper};
  margin-bottom: 10px;
  padding: 0rem 1.75rem;
  align-items: center;
  /* align-self: center; */
  color: ${({ theme }) => theme.palette.text.primary};
`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
`;

const UserComponent = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0 10px;
  align-self: center;
  align-items: center;
  align-content: center;
  cursor: pointer;

  span.name {
    margin-top: 10px;
    align-self: flex-end;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.email {
    margin-bottom: auto;
    font-size: 13px;
    opacity: 0.7;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const StatusView = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  > div {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  div.circle {
    margin-right: 5px;
    border-radius: 15px;
    height: 15px;
    width: 15px;
    border: 3px solid ${({ theme }) => theme.palette.status.successD};
    /* background-color:${({ theme }) => theme.palette.status.successD}; */

    ${(props) =>
      props.status == 'Ativo' &&
      css`
        border: 3px solid ${({ theme }) => theme.palette.status.successD};
      `}

    ${(props) =>
      props.status == 'Autenticando' &&
      css`
        border: 3px solid ${({ theme }) => theme.palette.status.yellow};
      `}

    ${(props) =>
      props.status == 'Pendente' &&
      css`
        border: 3px solid ${({ theme }) => theme.palette.status.orange};
      `}
  }
`;

const IconArrowDown = styled(KeyboardArrowDownIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};
  transform: rotate(${({ close }) => (close ? 0 : 180)}deg);
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const IconEdit = styled(Edit)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export function MembersTable({ isLoading, data, filter = true, isClient }) {
  const { setCurrentUser, setOldUser, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [userOpen, setUserOpen] = useState({});
  const history = useHistory();
  const mutation = useGetMoreClients();
  const mutationS = useSearchClients();
  console.log('reloaded userTable');

  const pending = 'Esperando usu??rio realizar cadastro na plataforma';
  const authenticating =
    'Usu??rio j?? criou sua conta na plataforma, mas n??o finalizado o cadastro.';
  const active = 'Usu??rio est?? ativo e em dia com suas atividades';

  function filterArray(search) {
    const searchParams = ['name', 'cpf', 'email'];
    const newData = [];
    data
      .filter((i) => i?.status)
      .map((row) => {
        if (!(!row?.link || (row?.link && row?.email))) return null;
        if (!search) return newData.push({ ...row });
        if (searchParams[0] && filterObject(row, search, searchParams[0]))
          newData.push({ ...row });
        else if (searchParams[1] && filterObject(row, search, searchParams[1]))
          newData.push({ ...row });
        else if (searchParams[2] && filterObject(row, search, searchParams[2]))
          newData.push({ ...row });
      });
    return newData;
    // return data.filter(i=>!i?.link||(i?.link && i?.email));
  }

  const DATA_REDUCE = React.useMemo(() => filterArray(search), [data, search]);
  const DATA = searchData.length === 0 ? DATA_REDUCE : searchData;

  async function onFilter(value) {
    console.log('uydegquy', isClient);
    if (isClient) {
      if (!value) {
        setSearchData([]);
        return setLoading(false);
      }
      const data = await mutationS.mutateAsync(value);
      console.log('data', data);
      setSearchData(data);
      setLoading(false);
    } else {
      setSearch(value);
    }
  }

  function handleOpenUser(uid) {
    if (userOpen?.uid === uid) return setUserOpen({});
    setUserOpen({ uid });
  }

  async function handleMore(setLoad) {
    setLoad(true);
    await mutation.mutateAsync();
    setLoad(false);
  }

  async function onCleanSearch() {
    setSearchData([]);
  }

  async function onEditUser(user) {
    history.push(PROFILE);
    setOldUser(currentUser);
    setCurrentUser({ ...user, emailVerified: true, manager: true });
  }

  return (
    <ContainerTable>
      <Title noFilter={!filter}>Membros</Title>
      {filter && (
        <FilterComponent
          style={{ marginBottom: 5 }}
          setLoading={setLoading}
          continueLoading={isClient}
          onCleanSearch={onCleanSearch}
          onStop={onFilter}
        />
      )}
      {!isLoading && !loading ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Usu??rio</TableHComponent>
                <TableHComponent>Data</TableHComponent>
                <TableHComponent>
                  CPF{isClient ? ' / CNPJ' : ''}
                </TableHComponent>
                <TableHComponent>Status</TableHComponent>
              </TableHeader>
              <TableBody>
                {DATA.map((user) => {
                  let tooltip = '';

                  switch (user?.status) {
                    case 'Pendente':
                      tooltip = pending;
                      break;

                    case 'Ativo':
                      tooltip = active;
                      break;

                    case 'Autenticando':
                      tooltip = authenticating;
                      break;

                    default:
                      tooltip = 'Situa????o n??o identificada';
                      break;
                  }

                  return (
                    <TableRow key={user.uid}>
                      <TableBComponent>
                        <UserComponent>
                          <AvatarView
                            style={{ gridRow: '1 / 3' }}
                            user={user}
                          />
                          <span className="name">
                            {user?.razao
                              ? user.razao
                              : user?.name
                              ? user.name
                              : '----------------------'}
                          </span>
                          <span className="email">
                            {user?.email
                              ? user.email
                              : '----------------------'}
                          </span>
                        </UserComponent>
                      </TableBComponent>
                      <TableBComponent>
                        <span>
                          {user?.creation
                            ? user.creation
                            : '----------------------'}
                        </span>
                      </TableBComponent>
                      <TableBComponent>
                        <span>
                          {user?.cnpj
                            ? formatCPFeCNPJeCEPeCNAE(user.cnpj)
                            : user?.cpf
                            ? formatCPFeCNPJeCEPeCNAE(user.cpf)
                            : '----------------------'}
                        </span>
                      </TableBComponent>
                      <TableBComponent>
                        <StatusView status={user?.status}>
                          <BootstrapTooltip
                            title={tooltip}
                            styletooltip={{ transform: 'translateY(-5px)' }}
                          >
                            <div>
                              <div className="circle" />
                              <span>
                                {user?.status
                                  ? user.status
                                  : '----------------------'}
                              </span>
                            </div>
                          </BootstrapTooltip>
                          {user?.status !== 'Pendente' && (
                            <BootstrapTooltip
                              title={`Editar Usuario.`}
                              styletooltip={{ transform: 'translateY(10px)' }}
                            >
                              <section>
                                <IconButton
                                  onClick={() => onEditUser(user)}
                                  aria-label={'IconArrowDown'}
                                >
                                  <IconEdit
                                    close={user.uid === userOpen?.uid}
                                  />
                                </IconButton>
                              </section>
                            </BootstrapTooltip>
                          )}

                          {user?.status === 'Pendente' ? (
                            <>
                              <BootstrapTooltip
                                title={`Revogar acesso a este usu??rio, o qual voc?? receber?? de volta os cursos que foram disponibilizados a ele.`}
                                styletooltip={{ transform: 'translateY(10px)' }}
                              >
                                <section>
                                  <IconLoadButton
                                    useMutation={useDeleteUsers}
                                    user={user}
                                    aria-label={'delete'}
                                  >
                                    <IconDelete />
                                  </IconLoadButton>
                                </section>
                              </BootstrapTooltip>
                            </>
                          ) : (
                            <IconButton
                              onClick={() => handleOpenUser(user.uid)}
                              aria-label={'IconArrowDown'}
                            >
                              <IconArrowDown
                                close={user.uid === userOpen?.uid}
                              />
                            </IconButton>
                          )}
                        </StatusView>
                      </TableBComponent>
                      <CollapseTable userOpen={userOpen} user={user} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <LoadMoreTableCells
              handleMore={isClient ? handleMore : false}
              shown={DATA.length}
              total={DATA.length}
            />
          </>
        ) : (
          <MissingData text={'Nenhum usu??rio // disponivel no momento'} />
        )
      ) : (
        <LoadTable rows={5} columns={5} />
      )}
    </ContainerTable>
  );
}
