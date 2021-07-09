import { Fade, IconButton, Tooltip } from '@material-ui/core';
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
import LinkIcon from '@material-ui/icons/Link';
import Lottie from 'react-lottie';
import copyJson from '../../../../assets/animations/copy.json';
import { useNotification } from '../../../../context/NotificationContext';

const IconCopy = styled(LinkIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
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
        display:flex;
        gap: 0 10px;
        align-items: center;
        cursor: pointer;

        &:active {
          opacity:0.7
        }
        &:hover {
          text-decoration: underline;

          svg {
            color: ${({theme})=>theme.palette.primary.main}
          }
        }
      }
    }

    td.curso {
      span {
        display:inline-block;
        max-width:280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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

    ${props => props.status == 'Pendente' && css`
      border: 3px solid ${({theme})=> theme.palette.status.orange};
    `}
  }
`;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: copyJson,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export function LinksURLTable({isLoading,data,filter=true}) {

  const notification = useNotification();
  const DATA = data.filter(i=>i?.link);

  function handleCopy(link) {
    navigator.clipboard.writeText(link)
    notification.success({message:'Link copiado com sucesso',modal:true})
  }


  return (
    <>
      <Title noFilter={!filter}>Links Compartilhaveis</Title>
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
                    <th>Link Conpartilhavel</th>
                    <th>Emissão</th>
                    <th>Cursos</th>
                    {/* <th>Tipo</th> */}
                    <th>Revogar link</th>
                  </tr>
                </thead>
                  <tbody>
                    {DATA.map((user) => {
                      const curso = user.cursos.map(item=>{
                        if (item?.epi) {
                          const epis = item.epi.map(epi=>{
                            return epi.name
                          }).join(', ')
                          return `${item.name} (${epis})`
                        }
                      }).join(', ')

                      return (
                        <tr key={user.uid}>
                          <td className='url'>
                            <Tooltip title={'copiar link'} TransitionComponent={Fade} placement="bottom-start" TransitionProps={{ timeout: {enter:500, exit: 50} }} >
                              <div onClick={()=>handleCopy(user.link)}>
                                <IconCopy/>
                                <span>{user?.link ?? '----------------------'}</span>
                              </div>
                            </Tooltip>
                          </td>
                          <td><span>{user?.creation ?? '----------------------'}</span></td>
                          <td className='curso' >
                            <BootstrapTooltip title={'EPI (bota, luva, capacete,bota, luva, capacete), NR 7 (Teleatendimento)'} styletooltip={{transform: 'translateY(-5px)'}}>
                              <span className='oneLine'>
                                {curso}
                              </span>
                            </BootstrapTooltip>
                          </td>
                          <td className='status'>
                            <StatusView status={user?.status}>
                              <BootstrapTooltip title={'tooltip'} styletooltip={{transform: 'translateY(-5px)'}}>
                                <div>
                                  <div className='circle'/>
                                  <span>{user?.status ?? '----------------------'}</span>
                                </div>
                              </BootstrapTooltip>
                              {user?.status ==='Pendente' &&
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
          <MissingData text={<p>Nenhum link disponivel  <br/>até o momento</p>}/>
        )
      ) : (
        <LoadTable rows={5} columns={5}/>
      )}
    </>
  )
}
