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
import { v4 } from 'uuid';
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
      // se for ultima aula aqui é falso
      newState.nextModule = nextModule.id;
      newState.nextClass = nextClass.id;
      newState.position = `${moduleIndex}/${classIndex}`;
    }
  }

  // edit user percentage
  if (newState.percentage === 1) {
    newState.expireDate = 0;
    newState.status = 'finished';
  }

  return { ...newState };
}

export async function setUpdateCurso(
  data: any,
  stateStudent: any,
  currentUser: any,
  dispatch: any,
) {
  const newStudent =
    'classIndex' in data
      ? onNewStudentDone(data, stateStudent, currentUser)
      : data; // se nao tem classndex, data quer dizer que é o valor de module (dado persiste de students)
  const studentsRef = db.collection('students');
  const cursoRef = db.collection('curso').doc(stateStudent.cursoId);
  const userRef = db.collection('users').doc(currentUser.uid);
  const certificationsRef = db.collection('certifications');
  const batch = db.batch();

  const userData: any = {};
  const now = new Date().getTime();
  // *finished
  if (newStudent.status === 'finished') {
    const cursoData = await cursoRef.get();
    const today = new Date(new Date().setHours(23, 59, 0, 0));
    userData.expireDate = 0;
    userData.status = 'finished';

    const certificationData: any = {};
    certificationData.validDate = 0;
    certificationData.email = currentUser.email;
    let cursoName = '';
    const course = {} as any;
    if (cursoData.exists) {
      const curso = cursoData.data();
      cursoName = curso?.name;

      if (curso?.accessTimeAfter) {
        const expireDate = new Date(
          today.setDate(today.getDate() + Number(curso.accessTimeAfter)),
        ).getTime();
        const cursoValidation = curso.cursoValidation
          ? new Date(
              today.setMonth(today.getMonth() + Number(curso.cursoValidation)),
            ).getTime()
          : 0;
        userData.expireDate = expireDate;
        newStudent.expireDate = expireDate;
        certificationData.validDate = cursoValidation;
        newStudent.validDate = cursoValidation;
        userData.validDate = cursoValidation;
      }

      course.initial_date = stateStudent.startDate;
      course.final_date = now;
      course.course_hours = curso?.duration;
      course.attendance = '100%';

      // dar a nota para o usuário 'Grade'
      course.grade = '10/10';
      certificationData.certificationEmail = curso?.certificationEmail;
      certificationData.validSignature = !!curso?.validSignature;
      certificationData.fileURL = false;
      certificationData.professionals = await Promise.all(
        curso?.professionals?.map(async (professional: any) => {
          const prof = await db
            .collection('users')
            .doc(professional.userId)
            .get();

          const userProf = prof.data();
          return {
            id: professional.userId,
            signature: userProf?.signatureURL,
            name: userProf?.name,
            job: professional.occupation,
          };
        }),
      );
      const arrayWatchedIds: string[] = [];

      Object.entries(stateStudent.watched).map(
        ([key, classes]: [string, any]) => {
          const array: string[] = [];
          array.push(key);
          classes.map((cls: string) => {
            array.push(cls);
          });

          if (array.length > 1) arrayWatchedIds.push(...array);
        },
      );

      const contents = [] as any;
      curso?.modules.map((module: any) => {
        const array = [];
        if (arrayWatchedIds.find((i) => i === module.id))
          array.push({
            id: module.name,
            type: 'module',
          });

        module.classes.map((classes: any) => {
          if (arrayWatchedIds.find((i) => i === classes.id))
            array.push({
              name: classes.name,
              type: 'class',
            });
        });

        if (array.length > 1) contents.push(...array);
      });
      certificationData.contents = contents;
    }
    userData.finishedDate = now;
    userData.studentId = newStudent.id;
    newStudent.finishedDate = now;

    const { id } = newStudent;
    batch.set(certificationsRef.doc(id), {
      ...certificationData,
      id,
      finishedDate: now,
      userId: currentUser.uid,
      name: currentUser.name,
      cpf: currentUser.cpf,
      cursoName,
      course,
      studentId: newStudent.id,
    });
  }

  dispatch({ type: 'MODULE_WRITE', payload: newStudent }); // salva no module dispacth para caso caiu internet ele posso recuperar

  const newCurso = [
    ...currentUser.cursos.map((curso: any) =>
      curso.id === newStudent.cursoId &&
      (curso.status === 'started' || curso.status === 'finished')
        ? { ...curso, percentage: newStudent.percentage, ...userData }
        : curso,
    ),
  ];

  batch.set(studentsRef.doc(newStudent.id), newStudent);
  batch.update(userRef, {
    // para editar porcetagem do curso e enviar para back
    cursos: newCurso,
  });
  await batch.commit();
  return { newStudent, data, newCurso };
}

export function useUpdateCurso(cursoId: string) {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useAuth();
  const student = queryClient.getQueryData<any>([
    'student',
    cursoId,
    currentUser.uid,
  ]);

  return useMutation(
    async (data) =>
      setUpdateCurso(data, student.student[0], currentUser, dispatch),
    {
      onSuccess: (data: any) => {
        const newStudent = { ...student };
        newStudent.student[0] = data.newStudent;
        queryClient.setQueryData(['student', cursoId, currentUser.uid], () => ({
          ...newStudent,
        }));

        if (data.newCurso) {
          setCurrentUser((user: any) => ({ ...user, curso: data.newCurso }));
        }
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
