import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";


export async function deleteCurso(curso) { //data = array of users {}

  const cursoRef = db.collection('curso');
  const batch = db.batch();

  batch.delete(cursoRef.doc(curso.id))
  batch.delete(cursoRef.doc(`${curso.id}-editorState`))

  await batch.commit();
  return curso
}

export function useDeleteCurso() {
  const notification = useNotification()
  const { currentUser, setCurrentUser } = useAuth();

  return useMutation(async(curso)=>deleteCurso(curso), { //data = array of users {}
    onSuccess: (curso) => {
      notification.success({message:'Curso deletado com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
      queryClient.setQueryData('cursos', (oldData) => [...oldData.filter(i=>i.id !== curso.id)]);
    },
    onError: (error) => {
      notification.error({message:errorCatchFirestore(error)})
    },
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
