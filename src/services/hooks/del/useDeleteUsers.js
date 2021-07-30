import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";
import {v4} from "uuid";



async function onDeleteRoot(userToDelete, isLink,batch) {
  const linksRef = db.collection('links').doc(userToDelete.uid);
  const invitesRef = db.collection('invites').doc(userToDelete.uid);

  if (isLink) {
    batch.delete(linksRef)
  } else {
    batch.delete(invitesRef)
  }

}

async function onDeleteReduce(userToDelete, user, batch) {
  const reduceRef = db.collection('reduce');

  const companyId = user.companyId
  const reduceType = 'users'
  let docId = null;

  const reduce = await reduceRef.where("id", "==", companyId).where("reduceType", "==", reduceType).get();
  let dataToUpdate = []

  reduce.forEach(doc=>{
    const isContentSameUser = doc.data().data.some(i=>i.uid == userToDelete.uid)
    if (isContentSameUser) {
      docId = doc.id
      dataToUpdate = doc.data().data.filter(i=>i.uid !== userToDelete.uid)
    }
  })

  if (docId) {
    batch.update(reduceRef.doc(docId),{data:dataToUpdate})
  }

  return
}

async function onAddUser(userToDelete, user, batch) {
  if (user.access === 'admin') return user

  const usersRef = db.collection('users').doc(user.uid);
  const statementsRef = db.collection('statement');
  let newUser = {...user}

  if (userToDelete?.statement && userToDelete.statement[0] && 'value' in userToDelete.statement[0] ) {

    const products = {
        type:'newUser',
        cursos: userToDelete.cursos,
        value: userToDelete.statement[0].value,
        shared: userToDelete?.email ?? userToDelete?.link
    }
    const docId = v4()

    batch.set(statementsRef.doc(docId),{
      id: docId,
      value:userToDelete.statement[0].value,
      type:'credit',
      created_at:(new Date()).getTime(),
      desc:'Reembolso',
      billId:user?.billId ?? '',
      companyId:user?.companyId ?? '',
      customer:user.name,
      customerId:user.uid,
      products
    })

    // if (!newUser?.statement) newUser.statement = []
    // newUser.statement = [...newUser.statement, {
    //   value:userToDelete.statement[0].value,
    //   type:'credit',
    //   desc:'Reembolso',
    //   id: docId,
    //   created_at:(new Date()).getTime(),
    //   buyer:user.name
    // }]

    if (!newUser?.credit) newUser.credit = 0
    newUser.credit = Number(newUser.credit) + Number(userToDelete.statement[0].value)
  }

  batch.update(usersRef,{statement:newUser.statement})
  return {...newUser}
}

export async function deleteUsers(userToDelete,user) { //data = array of users {}

  const batch = db.batch();
  console.log('onMutate',userToDelete)

  const isLink = userToDelete?.link
  await onDeleteRoot(userToDelete, isLink, batch)
  await onDeleteReduce(userToDelete, user, batch)
  const newUser = await onAddUser(userToDelete, user, batch)

  await batch.commit()

  return {newUser,uid:userToDelete.uid}
}

export function useDeleteUsers() {
  const notification = useNotification()
  const { currentUser, setCurrentUser } = useAuth();

  return useMutation(async(data)=>deleteUsers(data,currentUser), { //data = array of users {}
    onSuccess: (data, userToDelete) => {
      notification.success({message:'Convite revogado com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
      setCurrentUser(data.newUser)
      if (userToDelete.isPrimaryAccount && userToDelete.access == 'client') queryClient.setQueryData('clients', (oldData)=>[...oldData.filter(i=>i.uid !== data.uid)])
      else queryClient.setQueryData('users', (oldData)=>[...oldData.filter(i=>i.uid !== data.uid)])
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
