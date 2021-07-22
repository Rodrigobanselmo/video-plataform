import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { db } from "../../../lib/firebase.prod";


export async function getClientUsers(currentUser) {
  const usersRef = db.collection('users');
  const linksRef = db.collection('links');
  const invitesRef = db.collection('invites');
  const allLinks = []
  const allInvites = []
  const allUsers = []

  //Get Links
  const links = await linksRef.orderBy("createdAtAdmin").get(); //.where("createdByAdmin", "==", true)
  links.forEach(doc=>{
    allLinks.push({...doc.data()})
  })

  //Get Invites
  const invites = await invitesRef.orderBy("createdAtAdmin").limit('10').get();
  invites.forEach(doc=>{
    allInvites.push({...doc.data()})
  })

  //Get Users if allLinks menor que 10
  const limit = 10 - allInvites.length
  if (limit > 0) {
    const users = await usersRef.limit(limit).orderBy("createdAtClient").limit('10').get();
    users.forEach(doc=>{
    allUsers.push({...doc.data()})
  })}


  const sortLinks = allLinks.sort((a, b) => b.createdAt - a.createdAt)
  const sortInvites = allInvites.sort((a, b) => b.createdAt - a.createdAt)
  const sortUsers = allUsers.sort((a, b) => b.createdAt - a.createdAt)
  // const sortAuth = array.filter(i=>i.status === 'Autenticando').sort((a, b) => b.createdAt - a.createdAt)
  // const sortRest = array.filter(i=>i.status !== 'Autenticando' && i.status !== 'Pendente' && i.name).sort((a,b)=>AscendentObject(a,b,'name'))

  // sortRest.map((item)=>{
  //   let percentage = 0
  //   item.cursos.map(i=>{
  //     if (i?.percentage && i.) percentage = i.percentage + percentage
  //   })
  //   return item
  // })

  const response = [...sortLinks,...sortInvites,...sortUsers]

  return response
}

export function useClientUsers() {
  const {currentUser} = useAuth();
  const { setLoaderDash } = useLoaderDashboard();

  return useQuery('clients', ()=>getClientUsers(currentUser), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: () => {}
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
