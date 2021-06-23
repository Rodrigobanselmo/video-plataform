import {AddUserData,UpdateProfile,GetUser} from '../../../../services/firestoreUser'
import {SeeIfCEPExists} from '../../../../services/nodeCalls'
import {wordUpper,keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../../../../helpers/StringHandle'

export function onGetUser({uid,setData,notification,setLoaderDash}) {
  function checkSuccess(response) {
      setLoaderDash(false)
      console.log({...response})
      setData({...response})
    }

    function checkError(error) {
      setLoaderDash(false)
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    GetUser(uid,checkSuccess,checkError)
}

export function onEditUserData({currentUser,isEmail,setCurrentUser,setLoad,notification,dispatch}) {

    let formattedData = {...currentUser}
    if (formattedData.name) formattedData.name = wordUpper((formattedData.name.trim()).split(" "))

    setLoad(true)
    AddUserData(formattedData,!isEmail?currentUser.uid:currentUser.email,checkSuccess,checkError)
    function checkSuccess() {
        dispatch({ type: 'SAVE', payload: false })
        setCurrentUser({...formattedData})
        setLoad(false)
        notification.success({message:'Dados salvos com sucesso!'})
    }

    function checkError(error) {
        setLoad(false)
        setTimeout(() => {
            notification.error({message:error})
        }, 1000);
    }

}

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

export function onUpdateProfile({image,currentUser,setCurrentUser,setLoad,notification}) {

    setLoad(true)
    UpdateProfile(image,currentUser.uid,checkSuccess,checkError)
    function checkSuccess(url,later) {
        AddUserData({photoURL:url},currentUser.uid,()=>{
          setCurrentUser(currentUser=>({...currentUser,photoURL:url}))
          !later && setTimeout(() => {
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
