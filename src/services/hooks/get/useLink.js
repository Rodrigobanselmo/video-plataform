import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase.prod";

export async function getLink(code) {

  if (code == 0) return []
  const linkRef = db.collection('links').where('code', '==', code).get()

  const response = await linkRef
  const arrayData = [];
  console.log('refreshLink')

  response.forEach(function (doc) {
    arrayData.push({...doc.data()});
  });

  return arrayData
}

export function useLink(code) {
  return useQuery(['links', code], ()=>getLink(code), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
