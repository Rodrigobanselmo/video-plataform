import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase.prod";

export async function getLink(code) {

  if (code == 0) return []
  const linkRef = db.collection('links').where('code', '==', code)

  const response = await linkRef.get()
  const arrayData = [];
  console.log('refreshLink')

  response.forEach(function (doc) {
    arrayData.push({...doc.data(),docId:doc.id});
  });

  return arrayData
}

export function useLink(code) {
  return useQuery(['link', code], ()=>getLink(code), {
    staleTime: 1000 * 60 * 60 * 1
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
