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
import { queryClient } from '../../queryClient.js';

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

export async function setCreateCurso(data: any) {
  const cursoRef = db.collection('curso');
  const batch = db.batch();

  console.log('data', data);
  // upload image
  if (data?.main) batch.set(cursoRef.doc(data.main.id), data.main);
  if (data?.draft)
    batch.set(cursoRef.doc(`${data.main.id}-editorState`), data.draft);

  console.log('setCreateCurso', data);
  await batch.commit();

  return data;
}

export function useCreateCurso() {
  const notification = useNotification();

  return useMutation(async (data: any) => setCreateCurso(data), {
    onSuccess: async (data: any) => {
      const main = data?.main ?? {};
      const draft = data?.draft ?? {};

      queryClient.setQueryData('cursos', (oldData: any) => {
        let edited = false;
        const newData = oldData.map((curso: any) => {
          if (main?.id === curso.id && !curso?.editorState) {
            edited = true;
            return main;
          }
          if (draft?.id === curso.id && curso?.editorState) {
            edited = true;
            return draft;
          }
          return curso;
        });
        if (!edited) newData.push(main);
        if (!edited) newData.push(draft);

        console.log(`newData`, newData);
        return newData;
      });
      return data;
      // return {};
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
