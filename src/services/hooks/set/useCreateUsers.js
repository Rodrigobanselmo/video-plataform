import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";
import {v4} from "uuid";
import clone from "clone";

function newUser(currentUser,quantity) {
  if (currentUser.access === 'admin') return currentUser

  let user = {...currentUser} // *edit // Todo: remover cursos como distribuidor de cursos
  user = clone(user)// *edit // Todo: remover cursos como distribuidor de cursos

  Object.keys(quantity).map(key=>{
    const keySplit = key.split('--')
    const isQuantity = keySplit[0] === 'quantity'
    const isEpi = keySplit.length === 3

    if (isQuantity && !isEpi) { //se é um item de quantidade e nao de epi
      const cursoId = keySplit[1]
      const cursoIndex = user.availableCursos.findIndex(i=>i.id == cursoId)
      if (cursoIndex !== -1) user.availableCursos[cursoIndex] = {...user.availableCursos[cursoIndex],quantity:quantity[key]}

    }

    if (isQuantity && isEpi) {
      const cursoId = keySplit[1]
      const cursoIndex = user.availableCursos.findIndex(i=>i.id == cursoId && i?.data)

      if (cursoIndex !== -1) {
          let cursoData = {...user.availableCursos[cursoIndex]}
          const dataPriceIndex = cursoData.data.findIndex(i=>i.price == keySplit[2])
          if (dataPriceIndex !== -1) {
            cursoData.data[dataPriceIndex] = {...cursoData.data[dataPriceIndex],quantity:quantity[key]}
          }

          user.availableCursos[cursoIndex] = {...cursoData}
      }
    }
  })
  return user
}

export async function setUsers(dataAll,currentUser) { //data = array of users {}
  const userRef = db.collection('users').doc(currentUser.uid);
  const invitesRef = db.collection('invites');
  const linksRef = db.collection('links');
  const reduceRef = db.collection('reduce');
  const batch = db.batch();

  const quantity = dataAll.newQuantity
  const data = dataAll.DATA
  const newCurrentUser = newUser(currentUser,quantity)

  console.log('onMutate',data)
  console.log('quantity',quantity)
  console.log('newUser',newUser(currentUser,quantity))


  const reduceData = []

  //Edit user quantity cursos
  if (currentUser.access !== 'admin') batch.update(userRef,{availableCursos:newCurrentUser.availableCursos})


  //create docs
  data.map(user => {
    if (user?.link) {
      batch.set(linksRef.doc(user.uid), user);
    } else {
      batch.set(invitesRef.doc(user.uid), user);
    }

    // reduceData.push({
    //   cursos:user?.cursos ? user.cursos : false,
    //   name:user?.name ? user.name : false,
    //   link:user?.link ? user.link : false,
    //   email:user?.email ? user.email.toLowerCase() : false,
    //   cpf:user?.cpf ? user.cpf : false,
    //   type:user?.type ? user.type : false,
    //   status:user?.status ? user.status : false,
    //   creation:user?.creation ? user.creation : false,
    //   createdAt:user?.createdAt ? user.createdAt : false,
    //   uid:user?.uid ? user.uid : false,
    //   initialized: false,
    // })
    reduceData.push({...user,initialized: false})
  })

  //Reduce Read
  const companyId = newCurrentUser.companyId
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

  return {data,newCurrentUser}
}

export function useCreateUsers() {
  const notification = useNotification()
  const { currentUser,setCurrentUser } = useAuth()

  return useMutation(async(data)=>setUsers(data,currentUser), { //data = array of users {}
    onSuccess: (_data) => {
      notification.success({message:'Usuários criados com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?

      const {data, newCurrentUser} = _data

      setCurrentUser(newCurrentUser)

      const haveURL = data.map(item => {
        return item?.link
      }).filter(i=>i).length > 0

      if (haveURL) notification.modal({
        title: 'Sucesso',
        icon:'success',
        text:'Seu link compartilhavel foi criado e está disponivel nessa mesma página para que possa comparlihar com sua equipe',
        rightBnt:'Fechar',
        open:true,
      })

      if (!data[0].createdByAdmin) queryClient.setQueryData('users', (oldData)=>[...data,...oldData])
      if (data[0].createdByAdmin) queryClient.setQueryData('clients', (oldData)=>[...data,...oldData])
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
