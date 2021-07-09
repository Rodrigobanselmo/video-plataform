import { v4 } from 'uuid';
import { db, fb } from '../../lib/firebase.prod';

const errorCatch = (error) => {
  let errorMessage = error;

  if (error.code === 'permission-denied') {
    errorMessage = 'Você não possui permisão para realizar essa ação!';
  } else {
    errorMessage = error.message;
  }

  return errorMessage;
};

export async function SetNewUsersInvite(data, checkSuccess, checkError) {
  const array = [];
  const date = new Date();
  const dataUserRef = db.collection('data').doc('emailsPermissions');
  const batch = db.batch();

  data.array.map((item) => {
    const unform = data.unform[item.email.toLowerCase()]
      ? data.unform[item.email.toLowerCase()]
      : {};
    console.log('unform', unform);
    if (item?.id && item.id) {
      const pendingUsers = db.collection('users').doc(item.id);
      batch.update(pendingUsers, {
        creation: { start: date - 1, end: 0 },
        status: 'Ativo',
        access: 'admin',
        permissions: ['et'],
        ...unform,
      });
    } else {
      const pendingUsers = db.collection('users').doc(item.email.toLowerCase());
      batch.set(pendingUsers, {
        email: item.email.toLowerCase(),
        // type: item.type,
        creation: { start: date - 1, end: 0 },
        status: 'Aguardando Autenticação',
        access: 'admin',
        permissions: ['et'],
        name: '',
        uid: v4(),
        ...unform,
      });
    }
    batch.update(dataUserRef, {
      data: fb.firestore.FieldValue.arrayUnion(item.email.toLowerCase()),
    });
    array.push({
      email: item.email.toLowerCase(),
      // type: item.type,
      creation: date,
      status: 'Aguardando Autenticação',
      access: 'admin',
      permissions: ['et'],
      name: '',
      uid: v4(),
      ...unform,
    });
  });

  batch
    .commit()
    .then(() => {
      checkSuccess(array);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}
