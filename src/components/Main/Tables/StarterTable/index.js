import React, {useState} from 'react'
import IconButton from '@material-ui/core/IconButton';
import styled,{css} from "styled-components";
import { Icons } from '../../../Icons/iconsDashboard';
import { AvatarView } from '../../Avatar';
import { BootstrapTooltip } from '../../MuiHelpers/Tooltip';
// import { FilterComponent } from '../../Table/comp';
import { LoadMoreTableCells, LoadSkeleton } from '../elements/LoadMore';
import { LoadTable } from '../elements/LoadTable';
import { MissingData } from '../elements/MissingData';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { FilterComponent } from '../elements/Filter';
import { useDeleteUsers } from '../../../../services/hooks/del/useDeleteUsers';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { IconLoadButton } from '../elements/IconLoadButton';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PERMISSIONS } from '../../../../constants/geral';
import { CollapseTable } from './Collapse';


const ContainerTable = styled.div`
  padding-right:54px;

  @media screen and (max-width: 1100px) {
    padding-right:40px;
  }

  @media screen and (max-width: 700px) {
    padding-right:20px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: ${props=>props.noFilter ? '12px' : '1rem'};
`;




const Table = styled.div`
  min-width:1100px;
`;

const TableHeader = styled.div`
  display:grid;
  margin-bottom:10px;
  grid-template-columns: minmax(280px, 1.5fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr);
  padding: 0rem 1.75rem;
  align-items:center;
`;

const TableHComponent = styled.div`
  color: ${({theme})=>theme.palette.text.secondary};
  font-weight: 400;
  padding: 0.25rem 0.25rem;
  text-align: left;
  line-height: 1.5rem;
`;

const TableBody = styled.div`
`;

const TableRow = styled.div`
  display:grid;
  grid-template-columns: minmax(280px, 1.5fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr);
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
  box-shadow:  1px 1px 2px 1px rgba(0,0,0,0.2);
  background-color: ${({theme})=>theme.palette.background.paper};
  margin-bottom:10px;
  padding: 0rem 1.75rem;
  align-items:center;
  /* align-self: center; */
  color: ${({theme})=>theme.palette.text.primary};

`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
`;



const UserComponent = styled.div`

    display:grid;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0 10px;
    align-self:center;
    align-items: center;
    align-content: center;
    cursor: pointer;

    span.name {
      margin-top:10px;
      align-self: flex-end;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    span.email {
      margin-bottom:auto;
      font-size: 13px;
      opacity:0.7;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

`;

const StatusView = styled.div`
  display:flex;
  flex:1;
  flex-direction:row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

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

const IconArrowDown = styled(KeyboardArrowDownIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
  transform: rotate(${({close})=>close?0:180}deg);
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
`;

export function MembersTable({isLoading,data,filter=true,isClient}) {

  const [loading,setLoading] = useState(false)
  const [search,setSearch] = useState('')
  const [userOpen,setUserOpen] = useState({})

  const pending = 'Esperando usuário realizar cadastro na plataforma'
  const authenticating = 'Usuário já criou sua conta na plataforma, mas não finalizado o cadastro.'
  const active = 'Usuário está ativo e em dia com suas atividades'

  const DATA = data


  function onFilter(value) {
    setSearch(value)
  }

  return (
    <ContainerTable>
      <Title noFilter={!filter}>Membros</Title>
      {filter &&
        <FilterComponent
          style={{marginBottom:5}}
          setLoading={setLoading}
          onStop={onFilter}
        />
      }
      {(!isLoading && !loading) ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Nome</TableHComponent>
                <TableHComponent>Vencimento</TableHComponent>
                <TableHComponent>status</TableHComponent>
                <TableHComponent>Percentual</TableHComponent>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableBComponent><span>{item?.creation ? item.creation : '----------------------'}</span></TableBComponent>
                      <TableBComponent><span>{item?.creation ? item.creation : '----------------------'}</span></TableBComponent>
                      <TableBComponent><span>{item?.cpf ? item.cpf : '----------------------'}</span></TableBComponent>
                      <TableBComponent><span>{item?.cpf ? item.cpf : '----------------------'}</span></TableBComponent>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <LoadMoreTableCells shown={DATA.length} total={DATA.length}/>
          </>
        ) : (
          <MissingData text={'Nenhum usuário // disponivel no momento'}/>
        )
      ) : (
        <LoadTable rows={5} columns={5}/>
      )}
    </ContainerTable>
  )
}
