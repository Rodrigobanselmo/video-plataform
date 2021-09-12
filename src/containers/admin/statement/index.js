import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { useAuth } from '../../../context/AuthContext';
import { useGetStatement } from '../../../services/hooks/get/useGetStatement';
import { StatementTable } from '../../../components/Main/Tables/Statement';
import styled from 'styled-components';
import { BillTable } from '../../../components/Main/Tables/Bill';
import { useGetBill } from '../../../services/hooks/get/bill/useGetBill';

const Card = styled.div`
  padding: 1rem 2rem;
  background-image: linear-gradient(
    -10deg,
    ${({ theme }) => theme.palette.primary.main},
    ${({ theme }) => theme.palette.primary.light}
  );
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-bottom: 20px;
  width: fit-content;

  p {
    color: white;
    font-size: 0.92rem;
    &.extrato {
      font-weight: bold;
    }
    &.value {
      font-size: 2rem;
      margin: 10px 0 6px 0;
      font-weight: bold;
    }
    &.bottom {
    }
  }
`;
//undraw_mobile_testing_reah
export default function Statement() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const { setLoaderDash } = useLoaderDashboard();

  const { data, isLoading } = useGetBill();

  useEffect(() => {
    if (!isLoading) setLoaderDash(false);
  }, [isLoading]);

  if (!data && !data?.bill) return null;

  return (
    <div>
      {data?.bill && (
        <Card>
          <p className="extrato">Extrato atual</p>
          <p className="value">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(data?.bill?.openValue)}
          </p>
          <p className="bottom">
            <span>Último fechamento: &nbsp;</span>
            {data?.bill?.lastPayment ? (
              <b>
                {Intl.DateTimeFormat('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(data?.bill?.lastPayment))}
              </b>
            ) : (
              '- - -'
            )}
          </p>
        </Card>
      )}
      <BillTable data={data || []} isLoading={isLoading} />
    </div>
  );
}
