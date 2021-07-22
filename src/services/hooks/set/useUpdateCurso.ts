/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { v4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../context/AuthContext.js';
import { useLoaderDashboard } from '../../../context/LoadDashContext.js';
import { useNotification } from '../../../context/NotificationContext.js';
import { db, fb } from '../../../lib/firebase.prod.js';
import { errorCatchFirestore } from '../../error.js';
import { LogOut } from '../../firebaseAuth.js';
import { queryClient } from '../../queryClient.js';
import { VIDEO_ROUTE } from '../../../routes/routesNames.js';

function onNewStudentDone(data: any, stateStudent: any) {
  const {
    cursoId,
    moduleId,
    classId,
    nextModule,
    nextClass,
    classIndex,
    moduleIndex,
  } = data;
  const newState = { ...stateStudent };

  // adicionar percentage
  if (newState[`${cursoId}//${moduleId}//${classId}`])
    newState[`${cursoId}//${moduleId}//${classId}`] = {
      ...newState[`${cursoId}//${moduleId}//${classId}`],
      percentage: 100,
    };
  else newState[`${cursoId}//${moduleId}//${classId}`] = { percentage: 100 };

  // adicionar module percentage
  if (newState.watched && newState.watched[moduleId])
    newState.watched[moduleId] = [
      ...newState.watched[moduleId].filter((i: any) => i !== classId),
      classId,
    ];
  else newState.watched[moduleId] = [classId];

  let total = 0;
  Object.values(newState.watched).map((i: any) => {
    i.map((t: any) => {
      total += 1;
    });
  });
  newState.totalWatched = total;
  newState.percentage = total / newState.numOfClasses;

  // adicionar module last position //
  newState.lastModule = moduleId;
  newState.lastClass = classId;

  if (nextClass?.id && nextModule?.id) {
    // se for ultima aula aqui é falso
    newState.nextModule = nextModule.id;
    newState.nextClass = nextClass.id;
    newState.position = `${moduleIndex}/${classIndex}`;
  }

  // edit user percentage

  return { ...newState };
}

function later(delay: number) {
  return new Promise((resolve: any) => {
    setTimeout(resolve, delay);
  });
}

export async function setUpdateCurso(
  data: any,
  stateStudent: any,
  currentUser: any,
  dispatch: any,
) {
  const newStudent =
    'classIndex' in data ? onNewStudentDone(data, stateStudent) : data; // se nao tem classndex, data quer dizer que é o valor de module (dado persiste de students)
  const studentsRef = db.collection('students');
  const userRef = db.collection('users').doc(currentUser.uid);
  dispatch({ type: 'MODULE_WRITE', payload: newStudent }); // salva no module dispacth para caso caiu internet ele posso recuperar

  await studentsRef.doc(newStudent.id).set(newStudent);
  await userRef.update({
    // para editar porcetagem do curso e enviar para back
    cursos: [
      ...currentUser.cursos.map((curso: any) =>
        curso.id === newStudent.cursoId && curso.status === 'started'
          ? { ...curso, percentage: newStudent.percentage }
          : curso,
      ),
    ],
  });
  console.log('newStudent', newStudent);
  console.log('userMutation', data);
  return { newStudent, data };
}

export function useUpdateCurso(cursoId: string) {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const student = queryClient.getQueryData<any>(['student', cursoId]);

  return useMutation(
    async (data) =>
      setUpdateCurso(data, student.student[0], currentUser, dispatch),
    {
      onSuccess: (data: any) => {
        console.log('onSuccess', data);
        const newStudent = { ...student };
        newStudent.student[0] = data.newStudent;
        queryClient.setQueryData(['student', cursoId], () => ({
          ...newStudent,
        }));
      },
      onError: (error) => {
        console.log('onError', error);
      },
    },
  );
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

// const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
