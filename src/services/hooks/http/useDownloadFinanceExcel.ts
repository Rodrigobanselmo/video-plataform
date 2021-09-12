/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, UseMutationResult } from 'react-query';
import axios from 'axios';
import { saveAs } from 'file-saver';
import firebase from 'firebase/app';
import writeXlsxFile from 'write-excel-file';
import { useNotification } from '../../../context/NotificationContext.js';
import { keepOnlyNumbers } from '../../../helpers/StringHandle.js';
import { TestaCNPJ } from '../../../helpers/StringVerification.js';
import { db, fb, st } from '../../../lib/firebase.prod';
import { DateProvider } from '../../../helpers/DateProvider/implementation';

interface IBill {
  cpfOrCnpj: string;
  name: string;
  openValue: number;
  id: string;
  lastPayment: number;
  company: boolean;
}

interface ICursos {
  id: string;
  name: string;
  quantity: number;
  epi: {
    name: string;
    id: string;
  }[];
}

interface IProducts {
  cursos: ICursos[];
  data: {
    access: string;
    billId: string;
    code?: string;
    name?: string;
    cpf?: string;
    email?: string;
    companyId: string;
    created_at: number;
    cursos: any;
    isPrimaryAccount: boolean;
  };
  shared: string;
  type: 'deletedUser' | 'newUser';
  value: number;
}

interface IStatement {
  companyId?: string;
  type: 'credit' | 'debit';
  products: IProducts[];
  customerId: string;
  desc: string;
  buyer: string;
  value: number;
  created_at: number;
}

interface ISchema {
  company: string;
  cnpj: string;
  created_at: string;

  employees: string;
  cursosName: string;
  cursoValue: string;
  desc: string;
  // totalValue: string;
}

const schema = [
  {
    column: 'Empresa',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.company ?? '',
  },
  {
    column: 'CNPJ',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.cnpj ?? '',
  },
  {
    column: 'Data da compra',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.created_at ?? '',
  },
  {
    column: 'Nome do empregado',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.employees ?? '',
  },
  {
    column: 'Nome do curso',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.cursosName ?? '',
  },
  {
    column: 'Descrição',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.desc ?? '',
  },
  {
    column: 'Valor do curso',
    type: String,
    width: 40,
    value: (data: ISchema) => data?.cursoValue ?? '',
  },
  // {
  //   column: 'Valor total da compra',
  //   type: String,
  //   width: 40,
  //   value: (data: ISchema) => data?.totalValue ?? '',
  // },
];

export function useDownloadFinanceExcel() {
  const notification = useNotification();
  const dateProvider = new DateProvider();
  return useMutation(
    async (bill: IBill) => {
      const statementRef = db.collection('statement');
      const companyRef = db.collection('company');
      // const usersRef = db.collection('users');
      const arrayData = [] as IStatement[];
      const responseStatement = await statementRef
        .where('created_at', '>=', bill.lastPayment)
        .where(bill.company ? 'companyId' : 'customerId', '==', bill.id)
        .get();

      responseStatement.forEach(function (doc) {
        arrayData.push({ ...doc.data() } as IStatement);
      });
      console.log('bill', bill);
      console.log('arrayData', arrayData);
      const company: any = {
        company: '',
        cnpj: '',
      };

      if (bill.company) {
        const companyResponse = await companyRef.doc(bill.id).get();
        if (companyResponse.exists) {
          company.company = companyResponse.data()?.razao;
          company.cnpj = companyResponse.data()?.cpfOrCnpj;
        }
      }

      const cursosText = (cursos: ICursos[]) => {
        return cursos
          .map((item) => {
            if (item?.epi) {
              const epis = item.epi
                .map((epi) => {
                  return epi.name;
                })
                .join(', ');
              return `${item.name} (${epis})`;
            }
            return `${item.name}`;
          })
          .join(', ');
      };

      const ROW: any[] = [];
      arrayData.map((statement) => {
        const PARTIAL_DATA = {
          ...company,
          desc: statement.desc,
          created_at: dateProvider.format().short(statement.created_at),
        } as ISchema;
        statement.products.map((product) => {
          ROW.push({
            ...PARTIAL_DATA,
            employees: product.data?.name ?? 'Não identificado na compra',
            cursosName: cursosText(product.cursos),
            cursoValue: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.value * (product.type === 'newUser' ? 1 : -1)),
          });
        });
      });
      ROW.push({
        desc: 'Total',
        cursoValue: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(bill.openValue),
      });

      await writeXlsxFile(ROW, {
        schema, // optional
        fileName: 'file.xlsx',
      });

      console.log('ROW', ROW);
      return false;
    },
    {
      // data = array of users {}
      onSuccess: (response = false) => {
        response &&
          notification.success({
            message: response,
          });
      },
      onError: (error: string | { message: string }) => {
        if (typeof error === 'object' && error?.message) {
          notification.modal({
            title: 'Certificado a ser Assinado',
            text: error?.message,
            rightBnt: 'Ok',
            type: 'inform',
            open: true,
          });
        } else {
          notification.error({
            message: error || `Erro ao baixar certificado`,
          });
        }
      },
    },
  );
}
