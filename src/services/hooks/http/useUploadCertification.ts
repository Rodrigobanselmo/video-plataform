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

interface IMutate {
  certificationId: string;
  isAdmin?: boolean;
}

interface IUpload {
  userId: string;
  id: string;
  file: File;
}

export async function onFunction(
  certification: IUpload,
): Promise<void | string> {
  const certificationRef = db
    .collection('certifications')
    .doc(certification.id);
  const pdfBlob = certification.file;
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

  return `Certificado enviado com sucesso`;
}

export function useUploadCertification(): UseMutationResult<
  string | void,
  unknown,
  IUpload,
  unknown
> {
  const notification = useNotification();

  return useMutation(async (data) => onFunction(data), {
    // data = array of users {}
    onSuccess: (response = '') => {
      response &&
        notification.success({
          message: response,
        });
    },
    onError: (error: string | { message: string }) => {
      notification.error({
        message: error || `Erro ao baixar certificado`,
      });
    },
  });
}
