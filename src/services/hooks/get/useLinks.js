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

export async function getLinks(companyId) {
  const usersRef = db.collection('links');

    const response = await usersRef.where('companyId', '==', companyId).limit(5).get()
    const arrayData = [];
    console.log('refreshLinks')

    response.forEach(function (doc) {
      arrayData.push({...doc.data()});
    });

    return arrayData
}

export function useLinks() {
  const {currentUser} = useAuth();

  return useQuery('links', ()=>getLinks(currentUser.companyId), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
