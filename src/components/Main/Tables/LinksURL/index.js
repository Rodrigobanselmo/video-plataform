import React from 'react'
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
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
import { useDeleteUsers } from '../../../../services/hooks/del/useDeleteUsers';
import { IconLoadButton } from '../elements/IconLoadButton';

const ContainerTable = styled.div`
  padding-right:54px;

  @media screen and (max-width: 1100px) {
    padding-right:40px;
  }

  @media screen and (max-width: 700px) {
    padding-right:20px;
  }
`;


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
        width:40%;
        span {
          opacity:1;
        }
      }
      &:last-child {
        border-bottom-right-radius:0.25rem;
        border-top-right-radius:0.25rem;
        width:40%;
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

      svg {
        color: ${({theme})=>theme.palette.primary.main};
        font-size:24px;
      }

      span.subText {
        font-size:12px;
        color: ${({theme})=>theme.palette.text.secondary};
      }

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
      width:40%;

      span {
        max-width:330px;
        overflow: hidden;
        display:inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        /* display:-webkit-box; */
        /* -webkit-line-clamp:2; */
        /* -webkit-box-orient: vertical; */
        /* height:fit-content; */
      }

    }

    td.clear {
      background-color: transparent;
      -webkit-box-shadow: none;
      box-shadow:  none;
      padding:0;
      width:fit-content;
      min-width:fit-content;
    }

  }
`;

export function LinksURLTable({isLoading,data,filter=true}) {

  const notification = useNotification();
  // const mutation = useDeleteUsers()
  const DATA = data.filter(i=>(i?.link && !i?.email));

  function handleCopy(link) {
    navigator.clipboard.writeText(link)
    notification.success({message:'Link copiado com sucesso',modal:true})
  }

  function handleMore(setLoad) {
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
    }, 1000);
  }

  // function handleDelete(user) {
  //   mutation.mutateAsync(user)
  // }


  return (
    <ContainerTable >
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
                    <th>Emiss??o</th>
                    <th>Cursos</th>
                    {/* <th>Tipo</th> */}
                    {/* <th>Revogar link</th> */}
                  </tr>
                </thead>
                  <tbody>
                    {DATA.map((user) => {

                      const cursosText = () => {
                        if (!user?.availableCursos) return user.cursos.map(item=>{
                          if (item?.epi) {
                            const epis = item.epi.map(epi=>{
                              return epi.name
                            }).join(', ')
                            return `${item.name} (${epis})`
                          }
                          return `${item.name}`
                        }).join(', ')

                        return user.availableCursos.map(item=>{
                          return `${item.name} (${item.quantity})`
                        }).join(', ')
                      }

                      const curso = cursosText()

                      return (
                        <tr key={user.uid}>
                          <td className='url'>
                            <Tooltip title={'copiar link'} TransitionComponent={Fade} placement="bottom-start" TransitionProps={{ timeout: {enter:500, exit: 50} }} >
                              <div onClick={()=>handleCopy(user.link)}>
                                <IconCopy/>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                  <span>{user?.link ?? '----------------------'}</span>
                                  {user?.name && <span className='subText'>para: <strong>{user?.name}</strong></span>}
                                </div>
                              </div>
                            </Tooltip>
                          </td>
                          <td><span>{user?.creation ?? '----------------------'}</span></td>
                          <td className='curso' >
                            <BootstrapTooltip title={curso} styletooltip={{transform: 'translateY(-5px)'}}>
                              <span className='oneLine'>
                                {curso}
                              </span>
                            </BootstrapTooltip>
                          </td>
                          <td className='clear' style={{position:'absolute',right:30,top:'calc(50% - 25px)'}}>
                            <BootstrapTooltip title={`Revogar acesso a este usu??rio, o qual voc?? receber?? de volta os cursos que foram disponibilizados a ele.`} styletooltip={{transform: 'translateY(10px)'}}>
                              <div>
                                <IconLoadButton useMutation={useDeleteUsers} user={user} aria-label={'delete'}>
                                  <IconDelete type={'Trash'} />
                                </IconLoadButton>
                              </div>
                            </BootstrapTooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
              </table>
            </Container>
            <LoadMoreTableCells handleMore={handleMore} shown={DATA.length} total={DATA.length}/>
          </>
        ) : (
          <MissingData text={'Nenhum link disponivel  // at?? o momento'}/>
        )
      ) : (
        <LoadTable rows={5} columns={5}/>
      )}
    </ContainerTable>
  )
}
