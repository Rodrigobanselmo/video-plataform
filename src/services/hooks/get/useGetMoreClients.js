import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { db } from "../../../lib/firebase.prod";
import { queryClient } from "../../queryClient";


export async function getMoreClientUsers(limit) {




  const usersRef = db.collection('users');
  const invitesRef = db.collection('invites');

  const data = queryClient.getQueryData('clients')
  const lastVisible = data ? data[data.length -1] : {}
  const LIMIT = limit ? limit: 5

  const inviteData = [];
  const arrayData = [];
  var lastVisibleAgain = {};

  if (!lastVisible?._firestore) return null
  if (lastVisible.data()?.status === 'Pendente') {
    const inviteResponse = await invitesRef
      .orderBy('createdAt', 'desc')
      .where("access", "==", 'client')
      .where("isPrimaryAccount", "==", true)
      .startAfter(lastVisible)
      .limit(LIMIT)
      .get()
    inviteResponse.forEach(function (doc) {
      inviteData.push({...doc.data()});
    });
    lastVisibleAgain = inviteResponse.docs[inviteResponse.docs.length-1];

    const loadMore = inviteData.length >= LIMIT
    ? 0
    : LIMIT - inviteData.length

    if (loadMore > 0) {
      const response = await usersRef.orderBy('createdAt', 'desc').where("access", "==", 'client').limit(loadMore).get()
      lastVisibleAgain = response.docs[response.docs.length-1];

      response.forEach(function (doc) {
        arrayData.push({...doc.data()});
      });
    }
  } else if (lastVisible.data()?.status ) {
    const response = await usersRef
      .orderBy('createdAt', 'desc')
      .where("access", "==", 'client')
      .startAfter(lastVisible)
      .limit(LIMIT)
      .get()
    lastVisibleAgain = response.docs[response.docs.length-1];
    response.forEach(function (doc) {
      arrayData.push({...doc.data()});
    });
  }


  return [...inviteData,...arrayData, lastVisibleAgain]

}

export function useGetMoreClients() {
  // const {currentUser} = useAuth();

  return useMutation(async(limit)=>getMoreClientUsers(limit), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: (data) => {
      queryClient.setQueryData('clients', (oldData)=>[...oldData.filter(i=>!i?._firestore), ...data])
    }
  })
}
