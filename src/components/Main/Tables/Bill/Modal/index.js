import { Checkbox } from '@material-ui/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { NumberMoney } from '../../../../../lib/textMask';
import { InputEnd } from '../../../MuiHelpers/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useMutation } from 'react-query';
import { db } from '../../../../../lib/firebase.prod';
import { queryClient } from '../../../../../services/queryClient';
import { useNotification } from '../../../../../context/NotificationContext';
import { ModalButtons } from '../../../MuiHelpers/ModalButtons';
import { v4 } from 'uuid';
import { useAuth } from '../../../../../context/AuthContext';

export const FormLabel = styled(FormControlLabel)`
  color: ${({ theme }) => theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const NameField = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  border-top: 1px solid #55555555;
  padding-top: 10px;
`;

const CNPJField = styled.p`
  font-size: 0.85rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
`;

const PriceField = styled.p`
  padding: 2px 5px;
  margin-bottom: 20px;
  > p {
    color: #555;
  }
  color: green;
  ${(props) =>
    props.isWithdraw &&
    css`
      color: red;
    `}
`;

export function AddBillModal({ editData, open, onCloseModalAdd }) {
  const [data, setData] = useState(
    editData?.openValue < 0 ? Number(editData?.openValue) * -1 : '0',
  );
  const [checked, setChecked] = useState(true);
  const notification = useNotification();
  const { currentUser } = useAuth();

  const AddBillValue = useMutation(
    async () => {
      const docIdStatement = v4();
      const isBillClosing = checked;
      // const billRef = db.collection('bill').doc(editData.id);
      const statementsRef = db.collection('statement').doc(docIdStatement);
      if (isBillClosing) {
        statementsRef.set({
          id: docIdStatement,
          value: Math.abs(Number(data)),
          type: Number(data) > 0 ? 'credit' : 'debit',
          created_at: new Date().getTime(),
          desc: 'Fechamento de fatura',
          buyer: currentUser.name,
          buyerId: currentUser.uid,
          billId: editData.id,
          companyId: editData.id,
          customer: currentUser.name,
          customerId: currentUser.uid,
          lastPayment: true,
          products: [],
        });
        // await billRef.update({
        //   lastPayment: new Date().getTime(),
        //   openValue: editData?.openValue + Number(data),
        // });
      } else {
        statementsRef.set({
          id: docIdStatement,
          value: Math.abs(Number(data)),
          type: Number(data) > 0 ? 'credit' : 'debit',
          created_at: new Date().getTime(),
          desc: 'Mudança do valor pelo setor administrativo',
          buyer: currentUser.name,
          buyerId: currentUser.uid,
          billId: editData.id,
          companyId: editData.id,
          customer: currentUser.name,
          customerId: currentUser.uid,
          lastPayment: true,
          products: [],
        });
        // await billRef.update({
        //   openValue: editData?.openValue + Number(data),
        // });
      }
    },
    {
      onSuccess: () => {
        notification.success({ message: 'Fatura Editado com sucesso!' }); //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
        queryClient.setQueryData('bill', (oldData) => [
          ...oldData.map((bill) =>
            bill.id !== editData.id
              ? bill
              : {
                  ...bill,
                  lastPayment: new Date().getTime(),
                  openValue: editData?.openValue + Number(data),
                },
          ),
        ]);
      },
      onError: () => {
        notification.error({ message: 'Erro ao editar fatura' });
      },
    },
  );

  const onChange = ({ target }) => {
    const { value } = target;
    setData(value);
  };

  const handleChange = () => {
    setChecked(true);
    setData(editData?.openValue < 0 ? Number(editData?.openValue) * -1 : '');
  };

  const handleChange2 = () => {
    setChecked(false);
    setData('');
  };

  async function onEditComplete() {
    await AddBillValue.mutateAsync();
    onCloseModalAdd();
    setData('');
    setChecked(true);
  }

  return (
    <ModalButtons
      open={Boolean(open)}
      disable={AddBillValue.isLoading}
      onClick={onEditComplete}
      onClose={onCloseModalAdd}
      title={'Editar'}
      width={300}
    >
      <div>
        <NameField>{editData?.name}</NameField>
        <CNPJField>{editData?.cpfOrCnpj}</CNPJField>
        <div style={{ display: 'flex', gap: '40px' }}>
          <PriceField isWithdraw={editData?.openValue < 0}>
            <p>Fatura Atual</p>
            {editData?.openValue < 0 ? '- ' : 'crédito '}
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Math.abs(editData?.openValue))}
          </PriceField>
          <PriceField isWithdraw={editData?.openValue + Number(data) < 0}>
            <p>Fatura após mudança</p>
            {editData?.openValue + Number(data) < 0 ? '- ' : 'crédito '}
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Math.abs(editData?.openValue + Number(data)))}
          </PriceField>
        </div>
        <FormLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Fechar fatura"
        />
        <FormLabel
          control={
            <Checkbox
              checked={!checked}
              onChange={handleChange2}
              color="primary"
            />
          }
          label="Adiconar valor personalizado"
        />
        <InputEnd
          labelWidth={160}
          label="Indique a quantidade"
          icon="Info"
          width={'100%'}
          variant="outlined"
          value={data ? data : ''}
          disabled={checked}
          onChange={onChange}
          title="Informe a quantidade de reais que deseja adicionar ou retirar deste usuário"
          status="Normal"
          validation
          inputComponent={NumberMoney}
          statusStart={'money'}
        />
      </div>
    </ModalButtons>
  );
}
