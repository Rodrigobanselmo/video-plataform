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

export async function getUsers(companyId,limit) {
  const usersRef = db.collection('users');
  const invitesRef = db.collection('invites');
  console.log('refresh')

  const inviteResponse = await invitesRef.where('companyId', '==', companyId).limit(limit?limit:5).get()
  const inviteData = [];
  const arrayData = [];

  inviteResponse.forEach(function (doc) {
    inviteData.push({...doc.data()});
  });

  const loadMore = inviteData.length >= limit
    ? 0
    : limit - inviteData.length

  if (loadMore > 0) {
    const response = await usersRef.where('companyId', '==', companyId).limit(loadMore).get()

    response.forEach(function (doc) {
      arrayData.push({...doc.data()});
    });
  }


  return [...inviteData,...arrayData]
}

export function useUsers(limit) {
  const {currentUser} = useAuth();

  return useQuery('users', ()=>getUsers(currentUser.companyId,limit), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
