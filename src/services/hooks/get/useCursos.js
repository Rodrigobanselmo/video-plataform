import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
// import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { db } from "../../../lib/firebase.prod";

export async function getCursos(companyId) {
  const reduceRef = db.collection('curso');

  const cursos = await reduceRef.get();
  const array = []

  cursos.forEach(doc=>{
    array.push(doc.data())
  })

  return [...array]
}

export function useCursos() {
  // const { setLoaderDash } = useLoaderDashboard();
  const { currentUser } = useAuth()

  return useQuery('cursos', ()=>getCursos(), {
    staleTime: 1000 * 60 * 60 * 24,
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
