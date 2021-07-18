import { IconButton } from '@material-ui/core';
import React from 'react'
import styled,{css} from "styled-components";
import { Icons } from '../../../Icons/iconsDashboard';
import { AvatarView } from '../../Avatar';
import { BootstrapTooltip } from '../../MuiHelpers/Tooltip';
import { FilterComponent } from '../../Table/comp';
import { LoadMoreTableCells, LoadSkeleton } from '../elements/LoadMore';
import { LoadTable } from '../elements/LoadTable';
import { MissingData } from '../elements/MissingData';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const ContainerTable = styled.div`
  padding-right:54px;

  @media screen and (max-width: 1100px) {
    padding-right:40px;
  }

  @media screen and (max-width: 700px) {
    padding-right:20px;
  }
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
`;


const Title = styled.h1`
  font-size: 20px;
  margin-bottom: ${props=>props.noFilter ? '12px' : '1rem'};
`;

const Container = styled.div`
  margin-top: 0rem;
  margin-bottom: 0rem;

  table {
    width: 100%;
    min-width:1100px;
    border-spacing: 0 0.7rem;

    th {
      color: ${({theme})=>theme.palette.text.secondary};
      font-weight: 400;
      padding: 0rem 2rem;
      text-align: left;
      line-height: 1.5rem;
    }

    tbody tr {
      position:relative;
      border-radius: 0.25rem;
      -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
      box-shadow:  1px 1px 2px 1px rgba(0,0,0,0.2);
      &.clean {
        background-color: transparent;
        -webkit-box-shadow: none;
        box-shadow:  none;
      }
    }

    td {
      padding: 1rem 2rem;
      min-width:150px;
      background: ${({theme})=>theme.palette.background.paper};
      border: 0;
      color: ${({theme})=>theme.palette.text.primary};

      span {
        opacity:0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:first-child {
        border-bottom-left-radius:0.25rem;
        border-top-left-radius:0.25rem;
        width:30%;
        span {
          opacity:1;
        }
      }
      &:last-child {
        border-bottom-right-radius:0.25rem;
        border-top-right-radius:0.25rem;
      }

      &.clean {
        background-color: transparent;
        -webkit-box-shadow: none;
        box-shadow:  none;
        padding:0;
      }
    }

    td.url {
      padding: 0rem 2rem;
      align-self: center;
      color: ${({theme})=>theme.palette.text.primary};

      > div {
        display:grid;
        grid-template-columns: 60px 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 0 10px;
        align-content: center;
        cursor: pointer;


        span.name {
          align-self: flex-end;
          font-size: 14px;
        }

        span.email {
          font-size: 13px;
          opacity:0.7;
        }
      }
    }

    td.status {
      padding: 0rem 2rem;
    }
  }
`;

const StatusView = styled.div`
  display:flex;
  flex:1;
  flex-direction:row;
  justify-content: flex-start;
  align-items: center;

  > div {
    display:flex;
    flex:1;
    flex-direction:row;
    justify-content: flex-start;
    align-items: center;
  }

  div.circle {
    margin-right:5px;
    border-radius:15px;
    height: 15px;
    width: 15px;
    border: 3px solid ${({theme})=> theme.palette.status.successD};
    /* background-color:${({theme})=> theme.palette.status.successD}; */

    ${props => props.status == 'Ativo' && css`
      border: 3px solid ${({theme})=> theme.palette.status.successD};
    `}

    ${props => props.status == 'Autenticando' && css`
      border: 3px solid ${({theme})=> theme.palette.status.yellow};
    `}

    ${props => props.status == 'Pendente' && css`
      border: 3px solid ${({theme})=> theme.palette.status.orange};
    `}
  }
`;

export function MembersTable({isLoading,data,filter=true}) {

  const pending = 'Esperando usuário realizar cadastro na plataforma'
  const authenticating = 'Usuário já criou sua conta na plataforma, mas não finalizado o cadastro.'
  const active = 'Usuário está ativo e em dia com suas atividades'
  const DATA = data.filter(i=>!i?.link||(i?.link && i?.email));

  return (
    <ContainerTable>
      <Title noFilter={!filter}>Membros</Title>
      {filter &&
        <FilterComponent
          style={{marginBottom:5}}
          // setLoadContent={setLoadContent}
          // setSearch={setSearch}
          // search={search}
          // onCleanSearch={()=>setSearch('')}
        />
      }
      {!isLoading ? (
        DATA.length > 0 ? (
          <>
            <Container>
              <table>
                <thead>
                  <tr>
                    <th>Usuário</th>
                    {/* <th>Tipo</th> */}
                    <th>Data</th>
                    <th>CPF</th>
                    <th>Status</th>
                  </tr>
                </thead>
                  <tbody>
                    {DATA.map((user) => {
                      console.log('user',user)
                      let tooltip = ''

                      switch (user?.status) {
                        case 'Pendente':
                          tooltip = pending
                        break;

                        case 'Ativo':
                          tooltip = active
                        break;

                        case 'Autenticando':
                          tooltip = authenticating
                        break;

                        default:
                          tooltip = 'Situação não identificada'
                        break;
                      }

                      return (
                        <tr key={user.uid}>
                          <td className='url'>
                            <div>
                              <AvatarView style={{gridRow:'1 / 3'}} user={user}/>
                              <span className='name'>{user?.name ? user.name : '----------------------'}</span>
                              <span className='email'>{user?.email ? user.email : '----------------------'}</span>
                            </div>
                          </td>
                          {/* <td><span>{user?.type ? user.name : '----------------------'}</span></td> */}
                          <td><span>{user?.creation ? user.creation : '----------------------'}</span></td>
                          <td><span>{user?.cpf ? user.cpf : '----------------------'}</span></td>
                          <td className='status'>
                            <StatusView status={user?.status}>
                              <BootstrapTooltip title={tooltip} styletooltip={{transform: 'translateY(-5px)'}}>
                                <div>
                                  <div className='circle'/>
                                  <span>{user?.status ? user.status : '----------------------'}</span>
                                </div>
                              </BootstrapTooltip>
                              {(user?.status ==='Pendente') &&
                                <BootstrapTooltip title={`Revogar acesso a este usuário, o qual você receberá de volta os cursos que foram disponibilizados a ele.`} styletooltip={{transform: 'translateY(10px)'}}>
                                  <IconButton aria-label={'delete'}>
                                    <IconDelete type={'Trash'} />
                                  </IconButton>
                                </BootstrapTooltip>
                              }
                            </StatusView>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
              </table>
            </Container>
            <LoadMoreTableCells/>
          </>
        ) : (
          <MissingData text={<p>Nenhum usuário disponivel no momento</p>}/>
        )
      ) : (
        <LoadTable rows={5} columns={5}/>
      )}
    </ContainerTable>
  )
}
