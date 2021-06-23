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

export function SetProfessionsData(
  data,
  checkSuccess,
  checkError,
) {
  const professionRef = db.collection('data').doc('professionsData');

  var batch = db.batch();

  batch.set(professionRef,{...data})

  batch.commit().then(() => {
    checkSuccess('Document successfully updated!');
  }).catch((error) => {
    checkError(errorCatch(error));
    console.error('Error updating document: ', error);
  });
}

export function GetProfessionsData(checkSuccess,checkError,) {
  const professionRef = db.collection('data').doc('professionsData');
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

