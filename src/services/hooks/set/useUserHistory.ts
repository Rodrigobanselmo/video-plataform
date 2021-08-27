/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import axios from 'axios';
import { v4 } from 'uuid';
import { useNotification } from '../../../context/NotificationContext.js';
import { db } from '../../../lib/firebase.prod.js';
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

export async function setUser({ type, user }: any) {
  const usersRef = db.collection('users').doc(user.uid);
  const batch = db.batch();

  // GET IP

  const date = Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date());

  try {
    const time = new Date().getTime();
    if (!user?.lastView || user?.lastView + 1000 * 60 * 60 * 2 <= time) {
      const res = await axios.get('https://geolocation-db.com/json/');
      const { country_code, city, state, IPv4 }: any = res.data;

      const data = {
        id: v4(),
        location: `${city || ''} | ${state || ''} | ${country_code || ''}`,
        ip: IPv4 || '',
        date,
        action: type,
        time: new Date().getTime(),
      };
      batch.set(usersRef.collection('history').doc(), data);
    } else console.log('jumped');
  } catch {
    const data = {
      id: v4(),
      location: `| | |`,
      ip: '',
      date,
      action: 'inicialização',
      time: new Date().getTime(),
    };
    console.log(data);
    batch.set(usersRef.collection('history').doc(), data);
  }
  // try {
  // } catch {
  //   // const res = await axios.get('https://geolocation-db.com/json/');

  // }

  //

  // adicionando no users
  const lastView = new Date().getTime();
  batch.update(usersRef, { lastView });
  await batch.commit();

  return { lastView };
}

export function useUserHistory(setCurrentUser: any) {
  const notification = useNotification();

  return useMutation(async (data) => setUser(data), {
    onSuccess: (data: any) => {
      setCurrentUser((currentUser: any) => ({ ...currentUser, ...data }));
    },
    onError: (error) => {
      setTimeout(() => {
        notification.error({
          message: errorCatchFirestore(error),
          modal: true,
        });
      }, 600);
      // LogOut();
      // setCurrentUser(null);
    },
  });
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

// const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
