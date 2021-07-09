import { useMutation } from "react-query";
import { AuthProvider, useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";
import {v4} from "uuid";

export async function setUsers(data) { //data = array of users {}
  const invitesRef = db.collection('invites');
  const linksRef = db.collection('links');
  const reduceRef = db.collection('reduce');
  const batch = db.batch();
  console.log('onMutate',data)

  const reduceData = []

  //create docs
  data.map(user => {
    if (user?.link) {
      batch.set(linksRef.doc(user.uid), user);
    } else {
      batch.set(invitesRef.doc(user.uid), user);
    }

    reduceData.push({
      cursos:user?.cursos ? user.cursos : false,
      name:user?.name ? user.name : false,
      link:user?.link ? user.link : false,
      email:user?.email ? user.email : false,
      cpf:user?.cpf ? user.cpf : false,
      type:user?.type ? user.type : false,
      status:user?.status ? user.status : false,
      creation:user?.creation ? user.creation : false,
      createdAt:user?.createdAt ? user.createdAt : false,
      uid:user?.uid ? user.uid : false,
    })
  })

  //Reduce Read
  const companyId = data[0].companyId
  const reduceType = 'users'
  let docId = null;

  const reduce = await reduceRef.where("id", "==", companyId).where("reduceType", "==", reduceType).get();

  reduce.forEach(doc=>{
    if(doc.data().data.length < 500) docId=doc.id
  })

  if (docId === null) {
    docId = `${reduceType}-${v4()}`
    await reduceRef.doc(docId).set({
      id:companyId,
      reduceType:reduceType,
      data:[]
    })
  }

  batch.update(reduceRef.doc(docId),{data:fb.firestore.FieldValue.arrayUnion(...reduceData)})

  //commit final
  await batch.commit()

  return data
}

export function useCreateUsers() {
  const notification = useNotification()
  // const { currentUser } = useAuth()

  return useMutation(async(data)=>setUsers(data), { //data = array of users {}
    onSuccess: (data) => {
      notification.success({message:'Usuários criados com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?

      const users = [];
      const links = []
      const haveURL = data.map(item => {
        if (item?.link) links.push(item)
        else users.push(item)
        return item?.link
      }).filter(i=>i).length > 0

      if (haveURL) notification.modal({
        title: 'Sucesso',
        icon:'success',
        text:'Seu link compartilhavel foi criado e está disponivel nessa mesma página para que possa comparlihar com sua equipe',
        rightBnt:'Fechar',
        open:true,
      })

      console.log('onSuccess users',users)
      console.log('onSuccess links',links)
      queryClient.setQueryData('users', (oldData)=>[...users,...oldData])
      queryClient.setQueryData('links', (oldData)=>[...links,...oldData])
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
