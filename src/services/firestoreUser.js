import { v4 } from 'uuid';
import { db, st, fb } from '../lib/firebase.prod';

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

export function CreatePendingUser(data, checkSuccess, checkError) {
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
        // type: item.type,
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

export function AddUserData({
  data,
  uid,
  createCompany,
  checkSuccess,
  checkError,
}) {
  const userRef = db.collection('users').doc(uid);
  const companyRef = db.collection('company').doc(data?.companyId);

  const batch = db.batch();
  batch.update(userRef, { ...data });
  if (data?.companyId && createCompany)
    batch.set(companyRef, {
      id: data.companyId,
      ...data.company,
      ...data.address,
    });

  batch
    .commit()
    .then(() => {
      checkSuccess('Document successfully updated!');
    })
    .catch((error) => {
      checkError(errorCatch(error));
      console.error('Error updating document: ', error);
    });
}

export function GetUser(uid, checkSuccess, checkError) {
  const usersRef = db.collection('users').doc(uid);
  usersRef
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        checkSuccess(docSnapshot.data());
      } else checkError('Usuário não encontrado.');
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function GetUserData(user, checkSuccess, checkError) {
  const usersRef = db.collection('users').doc(user.uid);
  const date = new Date();

  function checkPendingUser() {
    const usersEmailRef = db.collection('users').doc(user.email.toLowerCase());
    usersEmailRef
      .get()
      .then((docSnapshots) => {
        if (docSnapshots.exists) {
          console.log(3);
          const docSnapshot = docSnapshots.data();
          db.collection('users')
            .doc(user.uid)
            .set({
              ...docSnapshot,
              uid: user.uid,
              email: user.email,
              creation: { start: date - 1, end: 0 },
              status: 'Ativo',
              name: '',
            })
            .then(() => {
              checkSuccess(
                {
                  ...docSnapshot,
                  uid: user.uid,
                  email: user.email,
                  creation: { start: date - 1, end: 0 },
                  status: 'Ativo',
                  name: '',
                },
                user,
              );
              usersEmailRef.delete().then(() => console.log('user deleted'));
            })
            .catch((err) => {
              checkError(errorCatch(err));
            });
        } else {
          // usersRef
          //   .set({
          //     email: user.email,
          //     name: '',
          //     uid: user.uid,
          //     info: {},
          //   })
          //   .then(() => {
          //     checkSuccess(
          //       {
          //         email: user.email,
          //         uid: user.uid,
          //         name: '',
          //         info: {},
          //       },
          //       user,
          //       true,
          //     );
          //   })
          //   .catch((err) => {
          //     checkError(errorCatch(err));
          //   });
        }
      })
      .catch((err) => {
        checkError(errorCatch(err));
      });
  }
  usersRef
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        checkSuccess(docSnapshot.data(), user);
      } else {
        checkPendingUser();
      }
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function SeeIfUserExists(email, checkSuccess, checkError) {
  const usersRef = db.collection('users');

  usersRef
    .where('email', '==', email)
    .get()
    .then(function (querySnapshot) {
      let response = [false, false];
      querySnapshot.forEach(function (doc) {
        const SeeIfHasBeenAdded = !!(doc.data() && doc.data()?.permissions);
        if (doc.id !== email) response = [doc.id, SeeIfHasBeenAdded];
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function GetAllUsersCompany(access, checkSuccess, checkError) {
  const usersRef = db.collection('users');

  usersRef
    .where('access', '==', access)
    .get()
    // eslint-disable-next-line func-names
    .then(function (querySnapshot) {
      const response = [];
      querySnapshot.forEach(function (doc) {
        const docx = doc.data();
        if (docx?.creation) {
          docx.end = docx.creation.end;
          docx.creation = docx.creation.start;
        }
        response.push(docx);
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function GetAllDataTwoFilters(access, filter, checkSuccess, checkError) {
  const usersRef = db.collection('users');

  usersRef
    .where('access', '==', access)
    .where('conector', '==', false)
    .get()
    .then(function (querySnapshot) {
      const response = [];
      querySnapshot.forEach(function (doc) {
        const docx = doc.data();
        if (docx?.creation) {
          docx.end = docx.creation.end;
          docx.creation = docx.creation.start;
        }
        response.push(docx);
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function GetAllConectors(arrayContains, checkSuccess, checkError) {
  const usersRef = db.collection('users');

  usersRef
    .where('permissions', 'array-contains', ['ec'])
    .get()
    .then(function (querySnapshot) {
      const response = [];
      querySnapshot.forEach(function (doc) {
        const docx = doc.data();
        if (docx?.creation) {
          docx.end = docx.creation.end;
          docx.creation = docx.creation.start;
        }
        response.push(docx);
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function UpdateProfile(image, uid, checkSuccess, checkError) {
  st.ref(`profile/${uid}`)
    .put(image)
    .then(() => {
      st.ref('profile')
        .child(uid)
        .getDownloadURL()
        .then((url) => {
          checkSuccess(url);
        })
        .catch((error) => {
          checkError(errorCatch(error));
        });
      // setTimeout(() => {
      //   st.ref("profile").child(`${uid}_300x300`).getDownloadURL().then(url => {
      //     checkSuccess(url,true);
      //   }).catch((error) => {
      //     checkError(errorCatch(error));
      //   });
      // }, 8000);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });

  // uploadTask.on(
  //   "state_changed",
  //   snapshot => {
  //     const progress = Math.round(
  //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //     );
  //     setProgress(progress);
  //   },
  //   error => {
  //     console.log(error);
  //   },
  //   () => {
  //     storage
  //       .ref("images")
  //       .child(image.name)
  //       .getDownloadURL()
  //       .then(url => {
  //         setUrl(url);
  //       });
  //   }
  // );
}

export async function InviteNewUsers(data, checkSuccess, checkError) {
  const array = [];
  const date = new Date();
  const dataUserRef = db.collection('data').doc('emailsPermissions');
  const batch = db.batch();

  data.array.map((item) => {
    const unform = data.unform[item.email.toLowerCase()]
      ? data.unform[item.email.toLowerCase()]
      : {};
    if (item?.id && item.id) {
      const pendingUsers = db.collection('users').doc(item.id);
      batch.update(pendingUsers, {
        // type: item.type,
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
