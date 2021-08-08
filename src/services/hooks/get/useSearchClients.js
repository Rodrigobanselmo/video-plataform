import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { keepOnlyNumbers } from "../../../helpers/StringHandle";
import { db } from "../../../lib/firebase.prod";
import { queryClient } from "../../queryClient";


export async function getMoreClientUsers(searchValue,avoidInvites) {


  const usersRef = db.collection('users');
  const invitesRef = db.collection('invites');
  const isString = !keepOnlyNumbers(searchValue.substring(0, 1)).length > 0 ? true : false
  const value = isString ? searchValue.toUpperCase() : searchValue.normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")

  const LIMIT = 5

  const arrayData = [];

  async function searchStringUsers() {
    if (isString) {
      await Promise.all(
        ["name","email","razao"].map(async (item)=>{
          console.log(item,value)
          const users = await usersRef
          // .where("access", "==", 'client')
          // .where("isPrimaryAccount", "==", true)
          .where(item, ">=", value)
          .where(item, "<=", String.fromCharCode(value.substring(0,1).charCodeAt() + 1))
          .limit(LIMIT)
          .get()

          users.forEach(function (doc) {
            arrayData.push({...doc.data()});
          });
          return null
        })
      );
    }

    if (!isString) {
      await Promise.all(
        ["cnpj","cpf"].map(async (item)=>{
          const users = await usersRef
          // .where("access", "==", 'client')
          // .where("isPrimaryAccount", "==", true)
          .where(item, ">=", value)
          .limit(LIMIT)
          .get()

          users.forEach(function (doc) {
            arrayData.push({...doc.data()});
          });
          return null
        })
      );
    }
    console.log(3)

    return arrayData
  }

  async function searchStringInvite() {

    if (avoidInvites) return []
    console.log(1)
    if (isString) {
      await Promise.all(
        ["name","email","razao"].map(async (item)=>{
          console.log(item,value)
          const invite = await invitesRef
          // .where("access", "==", 'client')
          // .where("isPrimaryAccount", "==", true)
          .where(item, ">=", value)
          .where(item, "<=", String.fromCharCode(value.substring(0,1).charCodeAt() + 1))
          .limit(LIMIT)
          .get()
          console.log(2)
          console.log(String.fromCharCode(value.substring(0,1).charCodeAt() + 1))

          invite.forEach(function (doc) {
            arrayData.push({...doc.data()});
          });
          return null
        })
      );
    }

    if (!isString) {
      await Promise.all(
        ["cnpj","cpf"].map(async (item)=>{
          console.log(item,value)
          const invite = await invitesRef
          // .where("access", "==", 'client')
          // .where("isPrimaryAccount", "==", true)
          .where(item, ">=", value)
          .limit(LIMIT)
          .get()

          invite.forEach(function (doc) {
            arrayData.push({...doc.data()});
          });
          return null
        })
      );
    }
    console.log(3)

    return arrayData
  }

  const arrayUsers = await searchStringInvite()
  const array = await searchStringUsers()
  console.log('arrayarray',arrayUsers,array)
  return [...arrayUsers,...array].filter((item, index)=>([...arrayUsers,...array].findIndex(i=>i.uid == item.uid) == index))

}

export function useSearchClients(avoidInvites) {
  // const {currentUser} = useAuth();

  return useMutation(async(value)=>getMoreClientUsers(value,avoidInvites), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: (data) => {
      return data
    }
  })
}
