import { AddCalendarDate,GetCalendarDate } from '../../../../services/firestoreCalendar'
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

  console.log('calendar',calendar)
  AddCalendarDate(calendar,currentUser,checkSuccess,checkError)

}

export function onGetCalendarDate({currentUser,notification,dispatch,setLoaderDash}) {

  function checkSuccess(resp) {
    // var dataUser = {id:currentUser.uid,name:currentUser.name,photoURL:currentUser?.photoURL?currentUser.photoURL:null}
    // dispatch({ type: 'CALENDAR_SET', payload: {...response, ...dataUser} })
    dispatch({ type: 'CALENDAR_SET', payload: {...resp} })
    console.log('resp',resp)
    setLoaderDash(false)
  }

  function checkError(error) {
    setLoaderDash(false)
    setTimeout(() => {
      notification.error({message:error,modal:false})
    }, 600);
  }


  GetCalendarDate(currentUser,checkSuccess,checkError)

}
