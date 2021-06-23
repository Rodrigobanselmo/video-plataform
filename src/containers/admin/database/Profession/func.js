import {GetProfessionsData,SetProfessionsData} from '../../../../services/firestoreData'
import {SeeIfCEPExists} from '../../../../services/nodeCalls'
import {wordUpper,keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../../../../helpers/StringHandle'

export function onGetProfessionData({setData,notification,setLoaderDash,setLoadContent}) {
  function checkSuccess(response) {
      setLoaderDash(false)
      setLoadContent(false)
      setData(Object.values(response))
    }

    function checkError(error) {
      setLoadContent(false)
      setLoaderDash(false)
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    GetProfessionsData(checkSuccess,checkError)
}

export function onSetProfessionData({data,notification,dispatch}) {
    function checkSuccess(response) {
      dispatch({ type: 'SAVE', payload: false })
      notification.success({message:'Dados salvos com sucesso!'})
    }

    function checkError(error) {
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    SetProfessionsData(data,checkSuccess,checkError)
}

