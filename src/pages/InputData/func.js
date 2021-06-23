import {AddUserData,UpdateProfile} from '../../services/firestoreUser'
import {SeeIfCEPExists} from '../../services/nodeCalls'
import {wordUpper,keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../../helpers/StringHandle'

export function onAddUserData({unform,currentUser,setCurrentUser,setLoad,notification}) {

    let formattedData = {...unform}
    // delete formattedData['complemento']
    // delete formattedData['logradouro']
    // delete formattedData['municipio']
    // delete formattedData['bairro']
    // delete formattedData['cep']
    formattedData.name = wordUpper((formattedData.name.trim()).split(" "))
    formattedData.politics = true

    console.log('final',formattedData)
    setLoad(true)
    AddUserData(formattedData,currentUser.uid,checkSuccess,checkError)
    // AddUserData(formattedData,currentUser.uid,checkSuccess,checkError,'admin',{creation:currentUser.creation,uid:currentUser.uid,name:formattedData.name,cpf:formattedData.cpf,email:formattedData.email})
    console.log('unform',unform)
    console.log('unform',formattedData)
    function checkSuccess() {
        setCurrentUser(currentUser=>({...currentUser,...formattedData}))
        setTimeout(() => {
            setLoad(false)
            notification.success({message:'Usuário criado com sucesso'})
        }, 1000);
    }

    function checkError(error) {
        setLoad(false)
        setTimeout(() => {
            notification.error({message:error})
        }, 1000);
    }

}

export function onUpdateProfile({image,setUnform,currentUser,setCurrentUser,setLoad,notification}) {

    setLoad(true)
    UpdateProfile(image,currentUser.uid,checkSuccess,checkError)
    function checkSuccess(url,later) {
        AddUserData({photoURL:url},currentUser.uid,()=>{
          setCurrentUser(currentUser=>({...currentUser,photoURL:url}))
          setUnform(unform=>({...unform,photoURL:url}))
          !later&&setTimeout(() => {
            setLoad(false)
            notification.success({message:'Imagem adicionada com sucesso'})
          }, 500);
        },checkError)
    }

    function checkError(error) {
        setLoad(false)
        setTimeout(() => {
            notification.error({message:error})
        }, 500);
    }

}

// export function onCheckCEP(value,setData,notification){

//   function checkSuccess(response) {
//     // if (response) {
//     //   setData(data=>({...data,cep:value, status:'Warn',message:'Cep já cadastrado'}))
//     // } else {
//     //   setData(data=>({...data,cep:value, status:'Check',message:'Cep válido'}))
//     // }
//   }

//   function checkError(error) {
//     notification.error({message:error?error:'Erro os adquirir CNPJ',modal:true})
//     setData(data=>({...data,CNPJ:value, status:'Warn',message:error}))
//   }

//   SeeIfCEPExists(formatCPFeCNPJeCEPeCNAE(value),companyId,checkSuccess,checkError)
// }
