import {GetAllUsersCompany} from '../../../../services/firestoreUser'

export function onGetAllUsersCompany(user,setUsersRows,setLoadContent,notification,setLoaderDash) {
    function checkSuccess(response) {
        setLoadContent(false)
        console.log('iofhewhifwihofhoifiehoiohfweoihwefhiofwehoiwfehiofwehiowefhiowfe',response)
        setUsersRows([...response])
        setLoaderDash(false)
      }

      function checkError(error) {
        setLoadContent(false)
        setTimeout(() => {
          notification.error({message:error})
        }, 600);
        setLoaderDash(false)
      }

    GetAllUsersCompany('admin',checkSuccess,checkError)
}
