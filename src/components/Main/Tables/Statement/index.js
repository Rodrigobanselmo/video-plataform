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
  grid-template-columns: minmax(280px, 3fr) minmax(100px, 1fr) minmax(100px, 200px);
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
  grid-template-columns: minmax(280px, 3fr) minmax(100px, 1fr) minmax(100px, 200px);
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
  box-shadow:  1px 1px 2px 1px rgba(0,0,0,0.2);
  background-color: ${({theme})=>theme.palette.background.paper};
  margin-bottom:10px;
  padding: 1rem 1.75rem;
  align-items:center;
  /* align-self: center; */
  color: ${({theme})=>theme.palette.text.primary};

`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
  font-size:1rem;
  &.withdrawn {
    span {
      color: ${({theme})=>theme.palette.status.fail};
      font-weight:bold;
    }
  }
  &.credit {
    span {
      color: ${({theme})=>theme.palette.status.successD};
      font-weight:bold;
      margin-left:8px;
    }
  }
`;


const IconArrowDown = styled(KeyboardArrowDownIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
  transform: rotate(${({close})=>close?0:180}deg);
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.text.secondary};
`;

export function StatementTable({isLoading,data}) {

  const DATA = data

  return (
    <ContainerTable>
      <Title >Faturas</Title>
      {(!isLoading) ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Descrição</TableHComponent>
                <TableHComponent>Data</TableHComponent>
                <TableHComponent>Valor</TableHComponent>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const isWithdrawn = item?.type === 'debit'
                  return (
                    <TableRow key={item.id}>
                      <TableBComponent><span>{item?.desc ? item.desc : '----------------------'}</span></TableBComponent>
                      <TableBComponent>
                        <span>
                          {
                            item?.created_at
                              ? Intl.DateTimeFormat('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              }).format(new Date(item.created_at))
                              : '----------------------'
                          }
                        </span>
                      </TableBComponent>
                      <TableBComponent className={isWithdrawn ?'withdrawn':'credit'}>
                        <span>
                          {isWithdrawn?'- ':''}
                          {item?.value
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(item.value)
                            : '----------------------'
                          }
                        </span>
                      </TableBComponent>
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
