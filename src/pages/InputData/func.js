import { AddUserData, UpdateProfile } from '../../services/firestoreUser';
import { SeeIfCEPExists } from '../../services/nodeCalls';
import {
  wordUpper,
  keepOnlyNumbers,
  formatCPFeCNPJeCEPeCNAE,
} from '../../helpers/StringHandle';

export function onAddUserData({
  data,
  createCompany,
  currentUser,
  setCurrentUser,
  setLoad,
  notification,
}) {
  let formattedData = { ...data, status: 'Ativo' };
  if (formattedData.manager) delete formattedData.manager;
  formattedData.name = wordUpper(formattedData.name.trim().split(' '));
  formattedData.initialized = true;
  formattedData.newUser = false;
  formattedData.juridica = formattedData.cnpj ? true : false;
  formattedData.cpf = keepOnlyNumbers(formattedData.cpf);
  if (currentUser?.companyId) formattedData.companyId = currentUser.companyId;

  console.log('final', formattedData);
  setLoad(true);
  AddUserData({
    data: formattedData,
    uid: currentUser.uid,
    createCompany,
    checkSuccess,
    checkError,
  });
  // AddUserData(formattedData,currentUser.uid,checkSuccess,checkError,'admin',{creation:currentUser.creation,uid:currentUser.uid,name:formattedData.name,cpf:formattedData.cpf,email:formattedData.email})
  console.log('unform', data);
  console.log('unform', formattedData);
  function checkSuccess() {
    setCurrentUser((currentUser) => ({ ...currentUser, ...formattedData }));
    setTimeout(() => {
      setLoad(false);
      notification.success({ message: 'Dados preenchidos com sucesso' });
    }, 1000);
  }

  function checkError(error) {
    setLoad(false);
    setTimeout(() => {
      notification.error({ message: error });
    }, 1000);
  }
}

export function onUpdateProfile({
  image,
  setUnform,
  currentUser,
  setCurrentUser,
  setLoad,
  notification,
}) {
  function checkError(error) {
    setLoad(false);
    setTimeout(() => {
      notification.error({ message: error });
    }, 500);
  }
  setLoad(true);
  UpdateProfile(image, currentUser.uid, checkSuccess, checkError);
  function checkSuccess(url, later) {
    AddUserData({
      data: { photoURL: url },
      uid: currentUser.uid,
      checkSuccess: () => {
        setCurrentUser((currentUser) => ({ ...currentUser, photoURL: url }));
        setUnform((unform) => ({ ...unform, photoURL: url }));
        !later &&
          setTimeout(() => {
            setLoad(false);
            notification.success({ message: 'Imagem adicionada com sucesso' });
          }, 500);
      },
      checkError,
    });
  }
}
