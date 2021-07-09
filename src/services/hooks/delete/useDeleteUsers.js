import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";

export async function setUsers(data) { //data = array of users {}
  const usersRef = db.collection('users');
  const linksRef = db.collection('links');
  const batch = db.batch();
  console.log('onMutate',data)

  data.map(user => {
    if (user?.link) batch.set(linksRef.doc(user.uid), user);
    else batch.set(usersRef.doc(user.uid), user);
  })

  await batch.commit()

  return data
}

export function useCreateUsers() {
  const notification = useNotification()
  return useMutation(async(data)=>setUsers(data), { //data = array of users {}
    onSuccess: (data) => {
      notification.success({message:'Convite revogado com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?

      queryClient.setQueryData('users', (oldData)=>[...oldData.filter(i=>i.uid === data.uid)])
      // queryClient.setQueryData('links', (oldData)=>[...oldData,...links])
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
