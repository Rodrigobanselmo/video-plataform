import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";



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
  let newAvailableCursos = [...user.availableCursos]

  userToDelete.cursos.map(cursoRemove => {
    const cursoAddIndex = newAvailableCursos.findIndex(i=>i.id === cursoRemove.id)
    const cursoAdd = newAvailableCursos[cursoAddIndex]

    if (cursoRemove?.epi) {
      const arrayPrice = cursoRemove?.epi.map(epi=>{
        return epi?.price
      })

      const newDataEpis = newAvailableCursos[cursoAddIndex].data.map(data => { //adicionar aos tipos de epis
        const newQuantity = data.quantity + arrayPrice.filter(i=>i == data.price).length
        return {...data,quantity:newQuantity}
      })

      newAvailableCursos[cursoAddIndex].quantity = cursoAdd.quantity + arrayPrice.length
      newAvailableCursos[cursoAddIndex].data = newDataEpis
    } else {
      newAvailableCursos[cursoAddIndex].quantity = cursoAdd.quantity + cursoRemove.quantity
    }
  })

  batch.update(usersRef,{availableCursos:newAvailableCursos})
  return {...user,availableCursos:newAvailableCursos}
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
    onSuccess: (data) => {
      notification.success({message:'Convite revogado com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
      setCurrentUser(data.newUser)
      queryClient.setQueryData('users', (oldData)=>[...oldData.filter(i=>i.uid !== data.uid)])
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
