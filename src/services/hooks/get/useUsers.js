import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { db } from "../../../lib/firebase.prod";

function getCreation(docData) {
  if (docData?.creation?.start) {
    return new Date(docData.creation.start).toLocaleDateString('pt-BR', {
      day:'2-digit',
      month:'long',
      year:'numeric',
    })
  }
}

function getType(docData) {
  if (docData?.permissions && docData.permissions.includes('ea')) {
    return 'Administrador'
  }

  if (docData?.permissions && docData.permissions.includes('co')) {
    return 'Instrutor'
  }

  return 'Padrão'
}

function getActivity(docData) {
  if (docData?.access === 'admin') {
    return docData?.status
  }
}

export async function getUsers(currentUser) {
  const reduceRef = db.collection('reduce');
  console.log('refresh')

  //Reduce Read
  const reduceType = 'users'
  let docId = null;

  const reduce = await reduceRef.where("id", "==", currentUser.companyId).where("reduceType", "==", reduceType).get();
  const array = []

  reduce.forEach(doc=>{
    array.push(...doc.data().data)
  })

  const sortPendent = array.filter(i=>i.status === 'Pendente').sort((a, b) => b.createdAt - a.createdAt)
  const sortAuth = array.filter(i=>i.status === 'Autenticando').sort((a, b) => b.createdAt - a.createdAt)
  const sortRest = array.filter(i=>i.status !== 'Autenticando' && i.status !== 'Pendente' && i.name).sort((a,b)=>AscendentObject(a,b,'name'))

  // sortRest.map((item)=>{
  //   let percentage = 0
  //   item.cursos.map(i=>{
  //     if (i?.percentage && i.) percentage = i.percentage + percentage
  //   })
  //   return item
  // })

  // const response = [...sortPendent,...sortAuth,...sortRest].filter(i=>i.access==currentUser.access)
  const response = [...sortPendent,...sortAuth,...sortRest]

  return response
}

export function useUsers({notDisableLoad}) {
  const {currentUser} = useAuth();
  const { setLoaderDash } = useLoaderDashboard();

  return useQuery('users', ()=>getUsers(currentUser), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: () => {
      if (!notDisableLoad) setLoaderDash(false)
    }
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
