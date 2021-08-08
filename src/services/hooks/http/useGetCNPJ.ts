/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, UseMutationResult } from 'react-query';
import axios from 'axios';
import { useNotification } from '../../../context/NotificationContext.js';
import { keepOnlyNumbers } from '../../../helpers/StringHandle.js';
import { TestaCNPJ } from '../../../helpers/StringVerification.js';

interface IDataCNPJ {
  address: {
    complemento: string;
    logradouro: string;
    municipio: string;
    bairro: string;
    uf: string;
    numero: string;
    cep: string;
  };
  company: {
    razao: string;
    cpfOrCnpj: string;
  };
}

export async function onGetCNPJ(cnpj: string): Promise<false | IDataCNPJ> {
  const value = keepOnlyNumbers(cnpj);

  const isValidCNPJ = TestaCNPJ(cnpj);

  if (!isValidCNPJ) return false;

  const response = await axios.get(
    `https://brasilapi.com.br/api/cnpj/v1/{${value}`,
  );

  const { data } = response;

  function seeIfExist(params: string): string {
    if (params) {
      return params;
    }
    return '';
  }

  const companyData = {
    company: {
      razao: data.razao_social,
      cpfOrCnpj: data.cnpj,
    },
    address: {
      complemento: seeIfExist(data.complemento),
      logradouro: seeIfExist(data.logradouro),
      municipio: seeIfExist(data.municipio),
      bairro: seeIfExist(data.bairro),
      uf: seeIfExist(data.uf),
      numero: seeIfExist(data.numero),
      cep: seeIfExist(data.cep),
    },
  };

  return companyData;
}

export function useGetCNPJ(): UseMutationResult<
  false | IDataCNPJ,
  unknown,
  string,
  unknown
> {
  const notification = useNotification();

  return useMutation(async (cnpj: string) => onGetCNPJ(cnpj), {
    // data = array of users {}
    onSuccess: (data) => {
      if (!data) notification.error({ message: `CNPJ inválido` });
    },
    onError: (error) => {
      notification.error({ message: `CNPJ não encontrado na Receita Federal` });
    },
  });
}
