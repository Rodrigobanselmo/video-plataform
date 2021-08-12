/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { useLoaderDashboard } from '../../../context/LoadDashContext.js';
import { useNotification } from '../../../context/NotificationContext.js';
import { db, st } from '../../../lib/firebase.prod.js';
import { errorCatchFirestore } from '../../error.js';
import { LogOut } from '../../firebaseAuth.js';

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

export async function setUploadImageCourse(data: any) {
  // const cursoRef = db.collection('curso');

  // upload image
  await st.ref(`curso/${data.id}`).put(data.imageFile);
  const ulr = await st.ref('curso').child(data.id).getDownloadURL();

  return ulr;
}

export function useUploadImage() {
  const notification = useNotification();

  return useMutation(async (data: any) => setUploadImageCourse(data), {
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
