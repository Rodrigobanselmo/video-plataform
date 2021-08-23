/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { v4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useLoaderDashboard } from '../../../../context/LoadDashContext.js';
import { useNotification } from '../../../../context/NotificationContext.js';
import { db } from '../../../../lib/firebase.prod.js';
import { errorCatchFirestore } from '../../../error.js';
import { queryClient } from '../../../queryClient.js';
import { VIDEO_ROUTE } from '../../../../routes/routesNames.js';

export async function setExpire(data: any, currentUser: any) {
  // data = array of users {}
  const userId = currentUser?.uid;
  const userRef = db.doc(`users/${userId}`);
  const studentsRef = db.collection('students');
  const batch = db.batch();
  const userSnap = await userRef.get();

  console.log('data student', data);

  async function onAddCurso({ cursos, index }: any) {
    // criar students e remover uma unidade de curso
    const today = new Date(new Date().setHours(23, 59, 0, 0));
    const expireDate = new Date(
      today.setDate(today.getDate() + Number(data.daysToExpire)),
    ).getTime();
    const newCursos = [...cursos];
    if (typeof newCursos[index].quantity === 'number')
      // se qunatity dentro do curso for numero
      newCursos[index] = {
        ...newCursos[index],
        quantity: newCursos[index].quantity - 1,
      };
    newCursos[index].status = 'started';
    newCursos[index].percentage = 0;
    newCursos[index].expireDate = data.daysToExpire ? expireDate : 0;

    const curso = newCursos[index];
    const epiArr: any[] = [];

    if (curso?.epi) {
      curso.epi.map((item: any) => {
        return epiArr.push(
          ...item.id.split('//'),
          // .filter((classId: string) => !classId.includes('-test')),
        );
      });
    }

    const cursoClasses = curso?.epi ? epiArr : 'all';

    const numOfClasses =
      (Array.isArray(cursoClasses) ? cursoClasses.length : 0) +
      data.numOfClasses;

    const lastView = new Date().getTime();
    batch.update(userRef, {
      lastView,
      cursos: newCursos,
    });

    const uniqueId = v4();
    batch.set(studentsRef.doc(uniqueId), {
      uid: userId,
      id: uniqueId,
      status: 'started',
      percentage: 0,
      startDate: new Date().getTime(),
      expireDate,
      finishedDate: false,
      cursoId: curso.id,
      modules: 'all',
      watched: {},
      classes: cursoClasses,
      position: '0/0',
      totalWatched: 0,
      numOfClasses,
    });

    // return {};
    await batch.commit();
    return { cursoId: curso.id, newCursos };
  }

  // pega o curso disponibilizado ou started
  if (userSnap.data()?.cursos) {
    const cursos = userSnap.data()?.cursos;

    const index = cursos.findIndex((i: any) => i.id === data.id);
    if (index >= 0) {
      // se index existir
      if (cursos[index]?.status === 'started') {
        // TODO: aqui vai ter que ver como fazer qunado finalizar curso
        console.log('started');
        return { cursoId: cursos[index].id };
      }
      if (cursos[index]?.quantity) {
        // se possui quantidade maior que 0 de cursos
        const response = await onAddCurso({ cursos, index }); // se o curso existe e possui quantidade maior que 0 ele vai criar students e remover uma unidade de curso
        return response;
      }
      return { error: 'Você não possui este curso.' };
    }
  }

  // pega o curso comprado // TODO preciso averiguar como vou fazer para adicionar cursos com availableCursos sem epi definido
  // if (userSnap.data()?.availableCursos) {
  //   const cursos = userSnap.data()?.availableCursos;

  //   const index = cursos.findIndex((i: any) => i.id === data.id);
  //   if (index >= 0) {
  //     // se index existir
  //     if (cursos[index]?.quantity) {
  //       // se possui quantidade maior que 0 de cursos
  //       const response = await onAddCurso({ cursos, index }); // se o curso existe e possui quantidade maior que 0 ele vai criar students e remover uma unidade de curso
  //       return response;
  //     }
  //     return { error: 'Você não possui este curso.' };
  //   }
  // }

  return { error: 'Você não possui este curso.' };
}

export function useExpireCurso() {
  const notification = useNotification();
  const { setLoaderDash } = useLoaderDashboard();
  const history = useHistory();
  const { currentUser, setCurrentUser } = useAuth();

  return useMutation(async (data) => setExpire(data, currentUser), {
    onSuccess: async (data: any) => {
      // console.log(data)
      if (data?.newCursos) {
        await queryClient.refetchQueries(['student']);
        setCurrentUser((user: any) => ({ ...user, cursos: data.newCursos }));
      }

      if (data?.cursoId) history.push(`${VIDEO_ROUTE}/${data.cursoId}`);

      if (data?.error) {
        notification.error({
          message: data.error,
          modal: true,
        });
      }

      setLoaderDash(false);
      console.log('userMutation', { ...data });
    },
    onError: (error) => {
      console.log('error onError', error);
      setTimeout(() => {
        notification.error({
          message: errorCatchFirestore(error),
          modal: true,
        });
      }, 600);
      setLoaderDash(false);
    },
  });
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

// const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
