import { db, st } from '../lib/firebase.prod.js';
import {v4} from "uuid";


export const errorCatch = (error) => {
  let errorMessage = error;

  if (error.code === 'storage/unknown') {
    errorMessage = 'Ocorreu um erro desconhecido.';
  } else if (error.code === 'storage/object-not-found') {
    errorMessage =
      'Não é possivel encontrar este arquivo em nosso banco de dados!';
  } else if (error.code === 'permission-denied') {
    errorMessage = 'Você não possui permisão para realizar essa ação!';
  } else {
    errorMessage = error.message;
  }

  console.log('error', error);
  console.log('error code', error.code);

  return errorMessage;
};

export function CreateCursoData(data,checkSuccess,checkError,) {
  const cursoRef = db.collection('curso').doc(data.id);

  var batch = db.batch();

  batch.set(cursoRef,{...data})

  batch.commit().then(() => {
    checkSuccess('Document successfully updated!');
  }).catch((error) => {
    checkError(errorCatch(error));
    console.error('Error updating document: ', error);
  });
}

export function UpdateStudentProgress(data,currentUser,checkSuccess,checkError,) {
  const studentRef = db.collection('students').doc(currentUser.uid);

  var batch = db.batch();

  batch.set(studentRef,{...data})

  batch.commit().then(() => {
    checkSuccess && checkSuccess('Document successfully updated!');
  }).catch((error) => {
    checkError && checkError(errorCatch(error));
    console.error('Error updating document: ', error);
  });
}

export async function GetStudentCursoData(currentUser,checkSuccess,checkError,) {

  try {
    const userCursoRef =  db.collection('students').doc(currentUser.uid);
    const userCursoData = await userCursoRef.get()

    if (userCursoData.exists) {//se id de usuario esta cadastrado no curso
      checkSuccess(userCursoData.data());
    } else {
      checkError('É necesário que você esteja cadastrado neste curso para continuar!');
    }
  } catch (error) {
    checkError(errorCatch(error));
  }
}

export async function GetCursoData(id,checkSuccess,checkError,) {

  try {
    const cursoRef = db.collection('curso').doc(id);
    const cursoData = await cursoRef.get()

    if (cursoData.exists) { //se id do curso existe
      checkSuccess(cursoData.data());
    }  else {
      checkError('Dado não encontrado.');
    }
  } catch (error) {
    checkError(errorCatch(error));
  }
}

export async function GetCursoDataValidatePage(id,currentUser,checkSuccess,checkError,) {

  function isNotAllPrivate(curso) {
    const hasPublicRoute = [];
    curso.modules.map((module)=>{
      module.classes.map((aula)=>{
        if (aula.private === false) {
          hasPublicRoute.push({aulaId:aula.id,moduleId:module.id})
        }
      })
    })
    return hasPublicRoute
  }

  try {
    const cursoRef = db.collection('curso').doc(id);
    const userCursoRef =  db.collection('students').doc(currentUser.uid);

    const cursoData = await cursoRef.get()
    if (cursoData.exists) { //se id do curso existe

      const userCursoData = await userCursoRef.get()

      if (userCursoData.exists) {//se id de usuario esta cadastrado no curso
        checkSuccess(cursoData.data(),userCursoData.data());
      } else {
        if (isNotAllPrivate(cursoData).length > 0) { //se rota possui videos publicos
          checkSuccess(cursoData.data(),isNotAllPrivate(cursoData));
        } else {
          checkError('É necesário que você esteja cadastrado neste curso para continuar!');
        }
      }

    }  else {
      checkError('Dado não encontrado.');
    }
  } catch (error) {
    checkError(errorCatch(error));
  }
  // professionRef
  //   .get()
  //   .then((docSnapshot) => {
  //     if (docSnapshot.exists) {
  //       checkSuccess(docSnapshot.data());
  //     } else checkError('Dado não encontrado.');
  //   })
  //   .catch((error) => {
  //     checkError(errorCatch(error));
  //   });
}

export function GetData(checkSuccess,checkError,type) {
  const professionRef = db.collection('data').doc(type);
  professionRef
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        checkSuccess(docSnapshot.data());
      } else checkError('Dado não encontrado.');
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

