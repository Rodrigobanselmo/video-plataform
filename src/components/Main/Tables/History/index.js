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

`;

const Table = styled.div`
`;

const TableHeader = styled.div`
  display:grid;
  margin-bottom:0px;
  grid-template-columns: 1.5fr 1fr 1fr ;
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
  max-height:400px;
  overflow-y: auto;
  padding:5px;
`;

const TableRow = styled.div`
  display:grid;
  grid-template-columns: 1.5fr 1fr 1fr ;
  flex-shrink:0;
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
  box-shadow:  1px 1px 2px 1px rgba(0,0,0,0.2);
  background-color: ${({theme})=>theme.palette.background.paper};
  margin-bottom:10px;
  padding: 0.50rem 0.75rem;
  align-items:center;
  /* align-self: center; */
  color: ${({theme})=>theme.palette.text.primary};

`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
`;

export function HistoryTable({isLoading,data}) {


  const DATA = data

  return (
    <ContainerTable>
      {(!isLoading) ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                {/* <TableHComponent>Atividade</TableHComponent> */}
                <TableHComponent>Quando</TableHComponent>
                <TableHComponent>Local</TableHComponent>
                <TableHComponent>IP</TableHComponent>
              </TableHeader>
              <TableBody>
                {DATA.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableBComponent>
                        <span>{item?.date ? item.date : '----------------'}</span>
                      </TableBComponent>
                      <TableBComponent>
                        <span>{item?.location ? item.location : '----------------'}</span>
                      </TableBComponent>
                      <TableBComponent>
                        <span>{item?.ip ? item.ip : '----------------'}</span>
                        <br/>
                        <span>{item?.action ? item.action : '----------------'}</span>
                      </TableBComponent>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <LoadMoreTableCells shown={DATA.length} total={DATA.length}/>
          </>
        ) : (
          <MissingData text={'Nenhum dado // disponivel no momento'}/>
        )
      ) : (
        <LoadTable rows={5} columns={5}/>
      )}
    </ContainerTable>
  )
}
