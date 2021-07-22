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
  padding: 1rem 0.25rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  span {
    font-size: 0.87rem;
  }
`;


const PercentageView = styled.div`

  display: flex;
  align-items: center;
  flex-direction:row;
  gap:10px;

  div.percentage  {
    position:relative;
    width:100%;
    height:12px;
    border-radius:30px;
    background-color: ${({theme})=>theme.palette.background.line};

    ${props => typeof props.percentage == 'number' && css`
      &:before {
        width: ${props.percentage}%;
        border-radius:50px;
        background-color: ${({theme})=>theme.palette.status.success};
        position: absolute;
        top:0;
        left:0;
        content: "";
        height: 12px;
      }
    `}
  }

  p {
    width:35px;
    text-align:right;
    word-spacing:2px;
    font-weight:bold;
    color: ${({theme})=>theme.palette.text.secondary};
    letter-spacing:0.5px;
  }


`;



const IconArrowDown = styled(KeyboardArrowDownIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
  transform: rotate(${({close})=>close?0:180}deg);
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
`;

const cursosText = (curso) => {
  if (curso?.epi) {
    const epis = curso.epi.map(epi=>{
      return epi.name
    }).join(', ')
    return `${curso.name} (${epis})`
  }
  if (curso?.name) return `${curso.name}`
  return `----------------------`
}

const expireFormate = (date) => {
  if (!date) return `----------------------`
  return Intl.DateTimeFormat("pt-BR").format(
    new Date(date)
  )
}

const setStatus = (status,isExpired) => {
  if (!status) return 'Não iniciado'
  if (isExpired) return 'Curso expirado'
  if (status === 'started') return 'Cursando'
  // TODO ver o que fazer depois de finalizar
}

const setPercentage = (percentage,isExpired) => {
  if (!percentage) return '----'
  if (isExpired) return '----'
  return Math.floor(percentage*100)
  // TODO ver o que fazer depois de finalizar
}

export function UserCursosTable({data}) {

  const DATA = data

  return (
    <>
      {DATA.length > 0 ? (
        <Table>
          <TableHeader>
            <TableHComponent>Nome</TableHComponent>
            <TableHComponent>Vencimento</TableHComponent>
            <TableHComponent>Status</TableHComponent>
            <TableHComponent>Percentual</TableHComponent>
          </TableHeader>
          <TableBody>
            {data.map((curso) => {
              const isExpired = new Date().getTime() > (curso?.expireDate ?? 0)

              return (
                <TableRow key={curso.id}>
                  <TableBComponent><span>{cursosText(curso)}</span></TableBComponent>
                  <TableBComponent><span>{expireFormate(curso?.expireDate)}</span></TableBComponent>
                  <TableBComponent><span>{setStatus(curso?.status,isExpired)}</span></TableBComponent>
                  <TableBComponent>
                    <PercentageView percentage={setPercentage(curso.percentage,isExpired)}>
                      <p>{setPercentage(curso.percentage,isExpired)}%</p>
                      <div className='percentage'/>
                    </PercentageView>
                  </TableBComponent>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <MissingData text={'Nenhum curso em // andamento até o momento'}/>
      )}
    </>
  )
}
