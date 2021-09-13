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
import { useGetMoreBill } from '../../../../services/hooks/get/bill/useGetMoreBill';
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDownloadFinanceExcel } from '../../../../services/hooks/http/useDownloadFinanceExcel';
import { ModalButtons } from '../../MuiHelpers/ModalButtons';
import { AddBillModal } from './Modal';
import { DateProvider } from '../../../../helpers/DateProvider/implementation';

const NameField = styled.p``;

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
    minmax(200px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(
      100px,
      200px
    )
    250px;
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
    minmax(200px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(
      100px,
      200px
    )
    250px;
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.palette.background.paper};
  margin-bottom: 10px;
  padding: 1rem 1.75rem;
  align-items: center;
  /* align-self: center; */
  color: ${({ theme }) => theme.palette.text.primary};
`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
  font-size: 1rem;
  &.withdrawn {
    span {
      color: ${({ theme }) => theme.palette.status.fail};
      font-weight: bold;
    }
  }
  &.credit {
    span {
      color: ${({ theme }) => theme.palette.status.successD};
      font-weight: bold;
      margin-left: 8px;
    }
  }
`;

const Certification = styled.div`
  display: flex;
  width: fit-content;
  min-width: fit-content;
  gap: 10px;
  cursor: pointer;

  p {
    width: fit-content;
    min-width: fit-content;
  }

  svg {
    color: #999;
    font-size: 1.1rem;
  }
`;

const Editar = styled.button`
  cursor: pointer;
  padding: 6px 15px;
  background-color: ${({ theme }) => theme.palette.status.infoD};
  font-weight: bold;
  color: #fff;
  border: none;
`;

export function BillTable({ isLoading, data }) {
  const DATA = data;

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const getMoreBill = useGetMoreBill();

  const downloadFinances = useDownloadFinanceExcel();

  const handleDownloadExcel = (item) => {
    if (downloadFinances.isLoading) return;
    downloadFinances.mutateAsync(item);
  };

  const onEdit = (item) => {
    setOpen(true);
    setEditData(item);
  };

  function onCloseModalAdd() {
    setOpen(false);
    setEditData({});
  }

  async function handleMore(setLoad) {
    setLoad(true);
    await getMoreBill.mutateAsync();
    setLoad(false);
  }

  return (
    <ContainerTable>
      <Title>Faturas</Title>
      {!isLoading ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Nome</TableHComponent>
                <TableHComponent>CPF/CNPJ</TableHComponent>
                <TableHComponent>Última Fatura</TableHComponent>
                <TableHComponent>Valor</TableHComponent>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  if (item?._firestore) return null;
                  const isWithdrawn = item?.openValue < 0;
                  return (
                    <TableRow key={item.id}>
                      <TableBComponent>
                        <span>
                          {item?.name ? item.name : '----------------------'}
                        </span>
                      </TableBComponent>
                      <TableBComponent>
                        <span>
                          {item?.cpfOrCnpj
                            ? item.cpfOrCnpj
                            : '----------------------'}
                        </span>
                      </TableBComponent>
                      <TableBComponent>
                        <span style={{ fontSize: 15 }}>
                          {item?.lastPayment
                            ? new DateProvider()
                                .format()
                                .short(item.lastPayment)
                            : 'Nenhuma até o momento'}
                        </span>
                      </TableBComponent>
                      <TableBComponent
                        className={isWithdrawn ? 'withdrawn' : 'credit'}
                      >
                        <span>
                          {isWithdrawn ? '- ' : ''}
                          {'openValue' in item
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(Math.abs(item.openValue))
                            : '----------------------'}
                        </span>
                      </TableBComponent>
                      <TableBComponent
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Certification
                          onClick={() => handleDownloadExcel(item)}
                        >
                          {downloadFinances.isLoading ? (
                            <CircularProgress size={18} />
                          ) : (
                            <GetAppIcon />
                          )}
                          <p>Baixar Planilha</p>
                        </Certification>
                        <Editar onClick={() => onEdit(item)}>Editar</Editar>
                      </TableBComponent>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <LoadMoreTableCells handleMore={handleMore} />
          </>
        ) : (
          <MissingData text={'Nenhum dado // disponivel no momento'} />
        )
      ) : (
        <LoadTable rows={5} columns={5} />
      )}
      {open && (
        <AddBillModal
          onCloseModalAdd={onCloseModalAdd}
          open={open}
          editData={editData}
        />
      )}
    </ContainerTable>
  );
}

// const isWithdrawn = item?.openValue < 0;
