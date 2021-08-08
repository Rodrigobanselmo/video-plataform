import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { db, fb } from "../../../lib/firebase.prod";
import { errorCatchFirestore } from "../../error";
import { queryClient } from "../../queryClient";
import {v4} from "uuid";
import clone from "clone";
import { useSendEmail } from "../post/useSendEmail";

function newUser(currentUser,total,actualUser,docIdStatement) {
  if (currentUser.access === 'admin') return currentUser
  if (currentUser.access !== 'admin') return currentUser

  let user = {...currentUser} // *edit // Todo: remover cursos como distribuidor de cursos
  user = clone(user)// *edit // Todo: remover cursos como distribuidor de cursos

  const statement = [];
  if (user?.statement) statement.push(...user.statement)

  statement.push({
    id: docIdStatement,
    value:total,
    type:'debit',
    created_at:(new Date()).getTime(),
    desc:'Compra de cursos para novos membros de sua empresa que foram convidados a fazer parte da plataforma',
    buyer:actualUser.name
  })

  return {...user, statement}
}

function later(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export async function setUsers(checkoutInfo,actualUser) { //data = array of users {}


// return later(9000)
  const currentUser = checkoutInfo.user;
  const usersRef = db.collection('users');
  const userRef = usersRef.doc(currentUser.uid);

  const statementsRef = db.collection('statement');

  const batch = db.batch();

  const total = checkoutInfo.total
  const data = checkoutInfo.data
  const docIdStatement = v4()
  const newCurrentUser = newUser(currentUser,total,actualUser,docIdStatement)

  console.log('onMutate',data)
  console.log('newUser',newUser(currentUser,total,actualUser,docIdStatement))


  const reduceData = []

  //Add statement

  if (!checkoutInfo?.noStatement) {

    const products = data.map(user=>{
      return {
        type:'updatedUser',
        cursos: user.cursos,
        value: user.statement[0].value,
        shared: user?.email ?? user?.link
      }
    })


    batch.set(statementsRef.doc(docIdStatement),{
      id: docIdStatement,
      value:total,
      type:'debit',
      created_at:(new Date()).getTime(),
      desc:'Atualização de cursos dos membros cadastrados em sua equipe',
      buyer:actualUser.name,
      buyerId:actualUser.uid,
      billId:newCurrentUser?.billId ?? '',
      companyId:newCurrentUser?.companyId ?? '',
      customer:newCurrentUser.name,
      customerId:newCurrentUser.uid,
      products
    })
  }

  //Edit user statements
  if (currentUser.access !== 'admin' && false) batch.update(userRef,{statement:newCurrentUser.statement})


  //create docs
  const newData = [];
  data.map(user => {
    console.log('user.uid',user.uid)
    const newUser = {}
    if (user?.name) newUser.name = user.name
    if (user?.cpf) newUser.cpf = user.cpf
    if (user?.cursos) newUser.cursos = user.cursos
    if (user?.cnpj) newUser.cnpj = user.cnpj
    if (user?.razao) newUser.razao = user.razao
    if (user?.permission) newUser.permission = user.permission
    if (user?.statement) newUser.statement = user.statement
    if (user?.isPrimaryAccount) newUser.isPrimaryAccount = user.isPrimaryAccount
    if (user?.type) newUser.type = user.type
    newData.push({...newUser,uid:user.uid})
    batch.update(usersRef.doc(user.uid), newUser);
  })

  //commit final
  await batch.commit()

  return {data:newData,newCurrentUser,actualUser}
}

export function useUpdateUsers() {
  const notification = useNotification()
  const { currentUser,setCurrentUser } = useAuth()
  const mutation = useSendEmail()

  return useMutation(async(data)=>setUsers(data,currentUser), { //data = array of users {}
    onSuccess: (_data) => {
      notification.success({message:'Usuários alterados com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
      const {data, newCurrentUser, actualUser} = _data

      const isSameUser = newCurrentUser.uid === actualUser.uid
      if (isSameUser) setCurrentUser(newCurrentUser)


      // //send email
      // data.map(item => {
      //   if (item?.email) {
      //     const emailOptions = {
      //       subject:'Cursos EAD - REALIZA',
      //       html:`
      //       <div>
      //         <p>
      //           <b>Seja Bem-vindo</b>
      //           você foi convidade para se cadastrar na plataforma RealizaEAD
      //           <br/>
      //         </p>
      //         <p>
      //           Link de acesso para se cadastrar:
      //           <a href="https://realizaconsultoria.netlify.app/login?email=${item.email}" >
      //             www.realizaconsultoria.com.br
      //           </a>
      //         </p>
      //         <p>Qualquer dúvida, entre em contato.</p>
      //       </div>
      //       `
      //     }

      //     mutation.mutateAsync({...emailOptions,email:item.email})
      //   }
      // })


      if (!data[0]?.isPrimaryAccount) queryClient.setQueryData(['users', currentUser.uid], (oldData)=>oldData.map(i=>{
        const index = data.findIndex(fi => fi.uid == i.uid);
        if (index === -1) return i
        return {...i, ...data[index]}
      }))
      if (data[0]?.isPrimaryAccount) queryClient.setQueryData('clients', (oldData)=>oldData.map(i=>{
        const index = data.findIndex(fi => fi.uid == i.uid);
        if (index === -1) return i
        return {...i, ...data[index]}
      }))
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
