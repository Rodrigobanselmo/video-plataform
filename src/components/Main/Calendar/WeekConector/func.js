import { AddCalendarDate,GetCalendarDate } from '../../../../services/firestoreCalendar'
import { GetData } from '../../../../services/firestoreData'
// import {useLoaderScreen} from '../../../../../context/LoaderContext'

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

export function onGetCalendarDate({setAllProfession,setAllProfessionData,notification,setLoaderDash}) {
  function checkSuccess(response) {
      setAllProfessionData(Object.values(response))
      GetData(checkSuccess2,checkError,'professions')
  }

  function checkSuccess2(response) {
      setLoaderDash(false)
      setAllProfession(response)
  }

    function checkError(error) {
      setLoaderDash(false)
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    GetData(checkSuccess,checkError,'professionsData')
}
