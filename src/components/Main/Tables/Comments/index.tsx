/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import styled, { css } from 'styled-components';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Icons } from '../../../Icons/iconsDashboard';
import { AvatarView } from '../../Avatar';
import { BootstrapTooltip } from '../../MuiHelpers/Tooltip';
// import { FilterComponent } from '../../Table/comp';
import { LoadMoreTableCells, LoadSkeleton } from '../elements/LoadMore';
import { LoadTable } from '../elements/LoadTable';
import { MissingData } from '../elements/MissingData';
import { FilterComponent } from '../elements/Filter';
import { useDeleteUsers } from '../../../../services/hooks/del/useDeleteUsers';
import { IconLoadButton } from '../elements/IconLoadButton';
import { PERMISSIONS } from '../../../../constants/geral';

const ContainerTable = styled.div``;

const Table = styled.div``;

const TableHeader = styled.div`
  display: grid;
  margin-bottom: 0px;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
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

const TableBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  flex-shrink: 0;
  grid-template-rows: fit-content() fit-content();
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.palette.background.paper};
  margin-bottom: 10px;
  padding: 0.5rem 0.75rem;
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
  gap: 0 5px;
  align-self: center;
  align-items: center;
  align-content: center;
  cursor: pointer;

  span.name {
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

interface IResponse {
  msg: string;
  created_at: number;
}

interface IMessage {
  msg: string;
  name: string;
  email: string;
  cursoId: string;
  photoURL: string;
  id: string;
  cursoName: string;
  uid: string;
  response: IResponse | boolean;
  classId: string;
  moduleId: string;
  created_at: number;
}

// interface IActiveUsers {
//   data: IMessage[];
//   answer: IMessage[];
// }

interface ITable {
  data: IMessage[];
  isLoading: boolean;
  onClickRow: (message: IMessage) => void;
}

export const CommentsTable = ({
  isLoading,
  data,
  onClickRow,
}: ITable): JSX.Element => {
  const DATA = data;

  const formatter = new Intl.RelativeTimeFormat('pt', {
    numeric: 'auto',
  });

  const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' },
  ];

  function formatTimeAgo(date: number): string | undefined {
    let duration = (date - new Date().getTime()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(
          Math.round(duration),
          division.name as Intl.RelativeTimeFormatUnit,
        );
      }
      duration /= division.amount;
    }
  }

  return (
    <ContainerTable>
      {!isLoading ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Aluno</TableHComponent>
                <TableHComponent>Message</TableHComponent>
                <TableHComponent>Curso</TableHComponent>
                <TableHComponent>Última Menssagem</TableHComponent>
              </TableHeader>
              <TableBody>
                {DATA.map((item) => {
                  return (
                    <TableRow onClick={() => onClickRow(item)} key={item.id}>
                      <TableBComponent>
                        <UserComponent>
                          <AvatarView
                            style={{ gridRow: '1 / 3', margin: '-5px 0' }}
                            user={item}
                          />
                          <span className="name">
                            {item?.name ? item.name : '------------'}
                          </span>
                          <span className="email">
                            {item?.email ? item.email : '------------'}
                          </span>
                        </UserComponent>
                      </TableBComponent>

                      <TableBComponent>
                        <span>
                          {item?.msg
                            ? item?.msg || '------------'
                            : '------------'}
                        </span>
                      </TableBComponent>

                      <TableBComponent>
                        <span>
                          {item?.cursoName
                            ? item?.cursoName || '------------'
                            : '------------'}
                        </span>
                      </TableBComponent>

                      <TableBComponent>
                        <span>
                          {item?.created_at
                            ? formatTimeAgo(item.created_at) || '------------'
                            : '------------'}
                        </span>
                      </TableBComponent>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        ) : (
          <MissingData text="Nenhuma conversa pendente" />
        )
      ) : (
        <LoadTable rows={5} columns={2} />
      )}
    </ContainerTable>
  );
};
