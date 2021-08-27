import { AddCalendarDate,GetCalendarDate } from '../../../services/firestoreCalendar'
import { GetData } from '../../../services/firestoreData'
import {GetAllDataTwoFilters} from '../../../services/firestoreUser'

export function onGetHomeData({setClients,notification,setLoaderDash}) {
    function checkSuccess(response) {
        setClients([...response])
        setLoaderDash(false)
      }

      function checkError(error) {
        setTimeout(() => {
          notification.error({message:error})
        }, 600);
        setLoaderDash(false)
      }

        setLoaderDash(true)
        GetAllDataTwoFilters('client',['conector', false],checkSuccess,checkError)
}


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

export function onGetProfessionDate({setAllProfession,notification,setLoaderDash}) {

  function checkSuccess(response) {

      const UsersID = []
      Object.keys(response).map(keyUID=>{
        response[keyUID].profession
        UsersID.push(keyUID)
      })
      GetAllDataTwoFilters('client',['conector', false],checkSuccess,checkError)
      setAllProfession(response)
      console.log('professions',response)
      console.log('professionsData',response)
  }

  function checkSuccess2(response) {
      setLoaderDash(false)

      console.log('professions',response)
  }

    function checkError(error) {
      setLoaderDash(false)
      setTimeout(() => {
        notification.error({message:error,modal:false})
      }, 600);
    }

    GetData(checkSuccess,checkError,'professions')
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
