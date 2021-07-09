import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
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

export async function getUsers(companyId) {
  const reduceRef = db.collection('reduce');
  console.log('refresh')

  //Reduce Read
  const reduceType = 'users'
  let docId = null;

  const reduce = await reduceRef.where("id", "==", companyId).where("reduceType", "==", reduceType).get();
  const array = []

  reduce.forEach(doc=>{
    array.push(...doc.data().data)
  })

  return [...array]
}

export function useUsers() {
  const {currentUser} = useAuth();

  return useQuery('users', ()=>getUsers(currentUser.companyId), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
