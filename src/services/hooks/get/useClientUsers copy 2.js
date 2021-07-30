import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { db } from "../../../lib/firebase.prod";
import { queryClient } from "../../queryClient";

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

export async function getUsers(currentUser, limit) {

  // const companyId = currentUser.companyId
  const usersRef = db.collection('users');
  const invitesRef = db.collection('invites');
  const linksRef = db.collection('links');

  // const users = queryClient.getQueryData('users');
  const LIMIT = limit ? limit: 1
  const inviteResponse = await invitesRef.orderBy('createdAt', 'desc').where("access", "==", 'client').where("isPrimaryAccount", "==", true).limit(LIMIT).get()
  const linksResponse = await linksRef.where("access", "==", 'client').where("isPrimaryAccount", "==", true).get()
  const linksData = [];
  const inviteData = [];
  const arrayData = [];

  inviteResponse.forEach(function (doc) {
    inviteData.push({...doc.data()});
  });

  linksResponse.forEach(function (doc) {
    linksData.push({...doc.data()});
  });

  const loadMore = inviteData.length >= LIMIT
  ? 0
  : LIMIT - inviteData.length

  if (loadMore > 0) {
    const response = await usersRef.orderBy('createdAt', 'desc').where("access", "==", 'client').limit(loadMore).get()

    response.forEach(function (doc) {
      arrayData.push({...doc.data()});
    });
  }

  const sortLinks = linksData.sort((a, b) => b.createdAt - a.createdAt)


  return [...sortLinks, ...inviteData,...arrayData]
}

export function useClientUsers(limit) {
  const {currentUser} = useAuth();
  const { setLoaderDash } = useLoaderDashboard();

  return useQuery('clients', ()=>getUsers(currentUser,limit), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: () => {
    }
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
