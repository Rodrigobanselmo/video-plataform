/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, UseMutationResult } from 'react-query';
import axios from 'axios';
import { saveAs } from 'file-saver';
import firebase from 'firebase/app';
import { useNotification } from '../../../context/NotificationContext.js';
import { keepOnlyNumbers } from '../../../helpers/StringHandle.js';
import { TestaCNPJ } from '../../../helpers/StringVerification.js';
import { db, fb, st } from '../../../lib/firebase.prod';
import { DateProvider } from '../../../helpers/DateProvider/implementation';

interface IDataCertification {
  name: string;
  cpf: string;
  userId: string;
  id: string;
  finishedDate: string;
  cursoName: string;
  fileURL?: string;
  validSignature?: boolean;
  date?: string;
  course: {
    initial_date: string;
    grade: string;
    final_date: string;
    attendance: string;
    course_hours: string;
  };
}

interface IMutate {
  certificationId: string;
  isAdmin?: boolean;
}

export async function onFunction({
  certificationId,
  isAdmin,
}: IMutate): Promise<void | string> {
  const certificationRef = db.collection('certifications').doc(certificationId);
  const docSnapshotCertification = await certificationRef.get();
  const dateProvider = new DateProvider();
  console.log(certificationId);
  if (!docSnapshotCertification.exists) {
    throw 'Você não possui o certificado deste curso ainda, finalize-o para obter.';
  }

  const certification = docSnapshotCertification.data() as IDataCertification;

  if (certification?.validSignature && !isAdmin) {
    if (!certification?.fileURL)
      throw {
        type: 'warn',
        message:
          'Seu certificado já foi enviado para ser assinado, assim que estiver disponivel para baixar te avisaremos por email.',
      };
  }

  if (certification?.fileURL && !isAdmin) {
    const url = certification.fileURL;
    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('target', '_blank');

    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    return;
  }

  certification.date = dateProvider.format().long(certification.finishedDate);
  certification.course.initial_date = dateProvider
    .format()
    .short(certification.course.initial_date);
  certification.course.final_date = dateProvider
    .format()
    .short(certification.course.final_date);

  const res = await axios({
    method: 'post',
    url: 'https://us-central1-reconecta-dev.cloudfunctions.net/pdfRoute/puppet',
    responseType: 'blob',
    data: certification,
  });

  const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

  if (!isAdmin) {
    await st
      .ref(`${certification.userId}/certifications/${certification.id}`)
      .put(pdfBlob);

    const ulr = await st
      .ref(`${certification.userId}/certifications`)
      .child(certification.id)
      .getDownloadURL();

    await certificationRef.update({
      fileURL: ulr,
    });
  }
  saveAs(pdfBlob, 'newPdf.pdf');
  return `Certificado encontra-se em sua área de transferencia`;
}

export function useDownloadCertification(): UseMutationResult<
  string | void,
  unknown,
  IMutate,
  unknown
> {
  const notification = useNotification();

  return useMutation(
    async ({ certificationId, isAdmin = false }) =>
      onFunction({ certificationId, isAdmin }),
    {
      // data = array of users {}
      onSuccess: (response = '') => {
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
