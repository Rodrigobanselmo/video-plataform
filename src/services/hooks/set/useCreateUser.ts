/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { useLoaderDashboard } from '../../../context/LoadDashContext.js';
import { useNotification } from '../../../context/NotificationContext.js';
import { db } from '../../../lib/firebase.prod.js';
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

export async function setUser(user: any) {
  // data = array of users {}
  const usersRef = db.collection('users').doc(user.uid);
  const invitesRef = db.collection('invites');
  const linksRef = db.collection('links');
  const batch = db.batch();

  const importantData = {
    displayName: user?.displayName,
    emailVerified: user?.emailVerified,
    email: user?.email,
    uid: user?.uid,
  };

  // se ja tiver cadastro
  const docSnapshot = await usersRef.get();
  if (docSnapshot.exists)
    return {
      photoURL: user?.photoURL,
      ...docSnapshot.data(),
      ...importantData,
    };
  // se for a primeira vez
  let DATA = {};
  let docId: any = null;

  const invite = await invitesRef.where('email', '==', user.email).get(); // procura no invite se tem por email

  if (!invite.empty) {
    // se tiver por email adciona
    invite.forEach((doc) => {
      docId = doc.id;
      DATA = {
        photoURL: user?.photoURL,
        ...doc.data(),
        ...importantData,
        status: 'Autenticando',
      };
    });
    if (docId) batch.delete(invitesRef.doc(docId));
  } else {
    // se nao, vai e procura nos links
    const linkData = await linksRef.where('email', '==', user.email).get();
    linkData.forEach((doc) => {
      docId = doc.id;
      DATA = {
        photoURL: user?.photoURL,
        ...doc.data(),
        ...importantData,
        status: 'Autenticando',
      };
    });
    console.log('docId', docId);
    batch.delete(linksRef.doc(docId));
    // if (docId) batch.delete(linksRef.doc(docId));
  }

  // adicionando no users
  batch.set(usersRef, DATA);
  await batch.commit();

  return { ...DATA, newUser: true };
}

export function useCreateUser(setCurrentUser: any) {
  const notification = useNotification();
  const { setLoaderDash } = useLoaderDashboard();

  return useMutation(async (data) => setUser(data), {
    onSuccess: (data: any) => {
      setCurrentUser(data);
      setLoaderDash(false);
      console.log('userMutation', { ...data });

      if (data?.newUser) {
        setTimeout(() => {
          notification.simple({ message: 'Seja bem-vindo!' });
        }, 1000);
      }
    },
    onError: (error) => {
      setTimeout(() => {
        notification.error({
          message: errorCatchFirestore(error),
          modal: true,
        });
      }, 600);
      LogOut();
      setLoaderDash(false);
      setCurrentUser(null);
    },
  });
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

// const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
