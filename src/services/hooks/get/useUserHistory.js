import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase.prod";

export async function getHistory(user) {

  // if (!user?.initialized) return []
  const historyRef = db.collection('users').doc(user.uid).collection('history')

  const response = await historyRef.orderBy('time', 'desc').limit(10).get()
  const arrayData = [];

  response.forEach(function (doc) {
    arrayData.push({...doc.data()});
  });

  return arrayData
}

export function useUserHistory(user) {
  return useQuery(['history', user.uid], ()=>getHistory(user), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
