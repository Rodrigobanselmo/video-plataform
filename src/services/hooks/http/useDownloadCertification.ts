/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, UseMutationResult } from 'react-query';
import axios from 'axios';
import { saveAs } from 'file-saver';
import firebase from 'firebase/app';
import { useNotification } from '../../../context/NotificationContext.js';
import { keepOnlyNumbers } from '../../../helpers/StringHandle.js';
import { TestaCNPJ } from '../../../helpers/StringVerification.js';
import { db, fb } from '../../../lib/firebase.prod';

interface IDataCertification {
  name: string;
  cpf: string;
  finishedDate: string;
  cursoName: string;
}

export async function onFunction(certificationId: string): Promise<void> {
  const certificationRef = db.collection('certifications').doc(certificationId);
  const docSnapshotCertification = await certificationRef.get();

  if (!docSnapshotCertification.exists) {
    throw 'Você não possui o certificado deste curso ainda, finalize-o para obter.';
  }

  const {
    cpf,
    finishedDate,
    cursoName,
    name,
  } = docSnapshotCertification.data() as IDataCertification;

  const date = Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(finishedDate));

  const data = {
    date,
    name,
    cpf,
    cursoName,
  };

  const res = await axios({
    method: 'post',
    url: 'https://us-central1-reconecta-dev.cloudfunctions.net/pdfRoute/pdf',
    responseType: 'blob',
    data,
  });

  const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
  saveAs(pdfBlob, 'newPdf.pdf');
}

export function useDownloadCertification(): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> {
  const notification = useNotification();

  return useMutation(async (certificationId) => onFunction(certificationId), {
    // data = array of users {}
    onSuccess: () => {
      notification.success({
        message: `Certificado encontra-se em sua área de transferencia`,
      });
    },
    onError: (error) => {
      notification.error({ message: error || `Erro ao baixar certificado` });
    },
  });
}
