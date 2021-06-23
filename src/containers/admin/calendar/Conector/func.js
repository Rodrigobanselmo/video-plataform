import { AddCalendarDate,GetCalendarDate } from '../../../../services/firestoreCalendar'
import { GetData } from '../../../../services/firestoreData'


export function onAddCalendarDate({calendar,currentUser,notification,setLoad,dispatch}) {

  setLoad(true)

  function checkSuccess(resp) {
    dispatch({ type: 'SAVE', payload: false })
    setLoad(false)
  }

  function checkError(error) {
    setLoad(false)
    setTimeout(() => {
      notification.error({message:error,modal:false})
    }, 600);
  }


  AddCalendarDate(calendar,currentUser,checkSuccess,checkError)

}

export function onGetProfessionDate({setAllProfession,setAllProfessionData,notification,setLoaderDash}) {

  function checkSuccess(response) {
      setAllProfessionData(Object.values(response))
      GetData(checkSuccess2,checkError,'professions')

      console.log('professionsData',response)
  }

  function checkSuccess2(response) {
      setLoaderDash(false)
      setAllProfession(response)

      console.log('professions',response)
  }

    function checkError(error) {
      setLoaderDash(false)
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    GetData(checkSuccess,checkError,'professionsData')
}

export function onGetCalendarDate({setCalendar,usersId,notification,setLoad}) {

  function checkSuccess(resp,userId) {
    setLoad(false)
    setCalendar(cal=>({...cal,[userId.uid]:{...resp}}))
  }

  function checkError(error) {
    setLoad(false)
    setTimeout(() => {
      notification.error({message:error,modal:false})
    }, 600);
  }


  if (usersId.length == 0) {
    setCalendar([])
    notification.warn({message:'Nenhum profisional cadastrado para essa área.',modal:false})
  } else {
    setLoad(true)
  }

  usersId.map(uid=>{
    GetCalendarDate({uid},checkSuccess,checkError)
  })

}
