/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import firebase from 'firebase';
import { auth,db } from '../lib/firebase.prod';

const errorCatch = (error) => {
  let errorMessage = error;

  if (error.code === 'auth/user-not-found') {
    errorMessage =
      'Usuario de email não cadastrado, por vafor cadastre-se antes de logar!';
  } else if (error.code === 'auth/network-request-failed') {
    errorMessage =
      'Falha de conexão com a internet, tente novamente quando estiver conectado a uma rede!';
  } else if (error.code === 'auth/invalid-email') {
    errorMessage = 'Endereço de e-mail mal formatado';
  } else if (error.code === 'auth/email-already-in-use') {
    errorMessage = 'O endereço de email já esta cadastrado!';
  } else if (error.code === 'auth/network-request-failed') {
    errorMessage =
      'Falha de conexão com a internet, tente novamente quando estiver conectado a uma rede!';
  } else if (error.code === 'auth/wrong-password') {
    errorMessage = 'Senha incorreta. Por favor, tente novamente';
  } else if (error.code === 'auth/too-many-requests') {
    errorMessage =
      'O Acesso a essa conta está temporariamente desabilitado devido ao grande números de requisoções ao servidor. Por favor, tente novamente mais tarde';
  } else {
    errorMessage = error.message;
  }

  console.log('error', error);
  console.log('error code', error.code);

  return errorMessage;
};

export async function CheckEmailExists(
  email,
  validCode,
  checkSuccess,
  checkError,
) {

  const invitesRef = db.collection('invites');

  try {
    const responseEmail = await auth.fetchSignInMethodsForEmail(email) //.then((response) => {
    if (responseEmail.length != 0 ) return checkSuccess(responseEmail);

    let EMAIL_EXIST = false
    const response = await invitesRef.where('email', '==', email).get()
    response.forEach(function () {
      EMAIL_EXIST = true
    })

    if (EMAIL_EXIST || validCode) return checkSuccess([]);

    return  checkError('Este endereço de email não possui permissão para se cadastrar.');

  } catch (error) {
    return checkError(errorCatch(error));
  }
}

export async function CreateEmail(
  email = '',
  password = '',
  linkData,
  checkSuccess,
  checkError
) {

  try {
    console.log('linkData',linkData)
    if (linkData !== false) {
      const linkRef = db.collection('links').doc(linkData.docId);
      await linkRef.update({email})
    }

    await  auth.createUserWithEmailAndPassword(email, password)
    setTimeout(() => checkSuccess(), 500);
  } catch (error) {
    checkError(errorCatch(error));
  }

}

export function SignInEmail(
  email = '',
  password = '',
  checkSuccess,
  checkError,
) {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((loggedUser) => {
      checkSuccess(loggedUser);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function RecoveryEmail(
  email = '',
  checkSuccess,
  checkError,
) {
  auth
    .sendPasswordResetEmail(email)
    .then(function () {
      checkSuccess();
    })
    .catch(function (error) {
      checkError(errorCatch(error));
    });
}

export function SendEmailVerification(checkSuccess,checkError) {
  var user = auth.currentUser;
  user.sendEmailVerification()
  .then(function () {
    checkSuccess();
  })
  .catch(function (error) {
    checkError(errorCatch(error));
  });
}

export function ReloadUser(checkSuccess,checkError) {
  var user = auth.currentUser;
  if (!user) return
  user.reload()
  .then(function () {
    checkSuccess(auth.currentUser);
  })
  .catch(function (error) {
    checkError(errorCatch(error));
  });
}

export function LogOut(
  checkSuccess,
  checkError,
) {
  auth
    .signOut()
    .then(() => {
      checkSuccess && checkSuccess();
    })
    .catch((error) => {
      checkError && checkError(errorCatch(error));
    });
}
