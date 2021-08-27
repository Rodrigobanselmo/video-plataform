import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { AscendentObject } from "../../../helpers/Sort";
import { db } from "../../../lib/firebase.prod";

export async function getUsers(professionals) {
  const usersRef = db.collection('users');
  if (!professionals) return []
  //Reduce Read

  const arrayOfProfessionals = await Promise.all(professionals.map(async (professional) => {
    const response = await usersRef.doc(professional.userId).get();

    if (!response.exists) {
      return null
    }

    const user = response.data()

    return {
      uid:user.uid,
      name:user.name,
      photoURL:user.photoURL,
      resume:user.resume,
      social:user.social,
      curriculum:user.curriculum,
      ...professional
    }
  }))

  return arrayOfProfessionals.filter(i=>i)
}

export function useProfessionals(professionals,cursoId) {


  return useQuery(['professionals', cursoId], ()=>getUsers(professionals), {
    staleTime: 1000 * 60 * 60 * 1,
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
