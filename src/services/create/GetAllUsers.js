import { db } from '../../lib/firebase.prod';

const errorCatch = (error) => {
  let errorMessage = error;

  if (error.code === 'permission-denied') {
    errorMessage = 'Você não possui permisão para realizar essa ação!';
  } else {
    errorMessage = error.message;
  }

  return errorMessage;
};

export function GetAllUsers(companyId) {
  const usersRef = db.collection('users');

  usersRef
    .where('companyId', '==', companyId)
    .limit(5)
    .get()
    // .then(function (querySnapshot) {
    //   const response = [];
    //   querySnapshot.forEach(function (doc) {
    //     const docx = doc.data();
    //     if (docx?.creation) {
    //       docx.end = docx.creation.end;
    //       docx.creation = docx.creation.start;
    //     }
    //     response.push(docx);
    //   });
    //   console.log('response firebase',response)
    //   return response;
    // })
    // .catch((error) => {
    //   return errorCatch(error);
    // });
}
