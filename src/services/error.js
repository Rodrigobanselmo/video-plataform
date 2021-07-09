
export const errorCatchAuth = (error) => {
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

export const errorCatchFirestore = (error) => {
  let errorMessage = error;

  if (error.code === 'permission-denied') {
    errorMessage = 'Você não possui permisão para realizar essa ação!';
  } else {
    errorMessage = error.message;
  }

  console.log('error', error);
  console.log('error code', error.code);

  return errorMessage;
};
