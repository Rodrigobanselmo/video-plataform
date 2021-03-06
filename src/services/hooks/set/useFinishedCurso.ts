/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../context/AuthContext.js';
import { db } from '../../../lib/firebase.prod.js';
import { queryClient } from '../../queryClient.js';

function onNewStudentDone(data: any, stateStudent: any, currentUser: any) {
  const {
    cursoId,
    moduleId,
    classId,
    nextModule,
    nextClass,
    classIndex,
    moduleIndex,
    testData,
  } = data;
  const newState = { ...stateStudent };

  const isTest = !!testData;

  if (!isTest) {
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

    let totalTest = 0;
    Object.values(newState).map((test: any) => {
      if (test?.data && test.percentage === 100) totalTest += 1;
    });

    newState.totalWatched = total;
    newState.percentage = (total + totalTest) / newState.numOfClasses;
  } else {
    // adicionar percentage

    if (newState[`${cursoId}//${moduleId}//${classId}`]) {
      const newTest = { ...newState[`${cursoId}//${moduleId}//${classId}`] };
      newTest.data = [...newTest.data, ...testData.data];
      newTest.percentage =
        newTest.percentage === 100 ? 100 : testData.percentage;

      newState[`${cursoId}//${moduleId}//${classId}`] = {
        ...newTest,
      };
    } else {
      newState[`${cursoId}//${moduleId}//${classId}`] = testData;
    }

    let total = 0;
    Object.values(newState.watched).map((i: any) => {
      i.map((t: any) => {
        total += 1;
      });
    });

    let totalTest = 0;
    Object.values(newState).map((test: any) => {
      if (test?.data && test.percentage === 100) totalTest += 1;
    });

    newState.totalWatched = total;
    newState.percentage = (total + totalTest) / newState.numOfClasses;
  }

  // adicionar module last position //
  if (!isTest || (isTest && testData.percentage === 100)) {
    newState.lastModule = moduleId;
    newState.lastClass = classId;

    if (nextClass?.id && nextModule?.id) {
      // se for ultima aula aqui ?? falso
      newState.nextModule = nextModule.id;
      newState.nextClass = nextClass.id;
      newState.position = `${moduleIndex}/${classIndex}`;
    }
  }

  // edit user percentage

  return { ...newState };
}

export async function setFinished(
  data: any,
  stateStudent: any,
  currentUser: any,
  dispatch: any,
) {
  const newStudent =
    'classIndex' in data
      ? onNewStudentDone(data, stateStudent, currentUser)
      : data; // se nao tem classndex, data quer dizer que ?? o valor de module (dado persiste de students)
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

export function useFinishedCurso(cursoId: string) {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const student = queryClient.getQueryData<any>([
    'student',
    cursoId,
    currentUser.uid,
  ]);

  return useMutation(
    async (data) =>
      setFinished(data, student.student[0], currentUser, dispatch),
    {
      onSuccess: (data: any) => {
        console.log('onSuccess', data);
        const newStudent = { ...student };
        newStudent.student[0] = data.newStudent;
        queryClient.setQueryData(['student', cursoId, currentUser.uid], () => ({
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
