/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { useLoaderDashboard } from '../../../context/LoadDashContext.js';
import { useNotification } from '../../../context/NotificationContext.js';
import { st } from '../../../lib/firebase.prod.js';
import { errorCatchFirestore } from '../../error.js';

// interface UserData {
//   cursos: any;
//   name: string;
//   link: string | false;
//   email: string;
//   cpf: string;
//   type: string;
//   status: any;
//   creation: string;
//   createdAt: number | string;
//   uid: string;
// }

export async function setUpload(data: any) {
  // const cursoRef = db.collection('curso');

  // pegando tipo de arquivo
  const nameFile = data.file.name;
  // const splitNameFile = nameFile.split('.');
  // const extensionFileName = `.${splitNameFile[splitNameFile.length - 1]}`;

  // const downloadFileName = `Material${extensionFileName}`;

  // upload image
  await st.ref(`curso/${data.id}/${nameFile}`).put(data.file);
  const ulr = await st.ref(`curso/${data.id}`).child(nameFile).getDownloadURL();

  return ulr;
}

export function useUploadFile() {
  const notification = useNotification();

  return useMutation(async (data: any) => setUpload(data), {
    onSuccess: async (ulr: string) => {
      return ulr;
    },
    onError: (error) => {
      notification.error({
        message: errorCatchFirestore(error),
        modal: true,
      });
    },
  });
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

// const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
