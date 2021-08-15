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
  const userRef = db.collection('users').doc(currentUser.uid);
  const invitesRef = db.collection('invites');
  const linksRef = db.collection('links');
  const reduceRef = db.collection('reduce');

  // const isStatementForEachUser = checkoutInfo.statementForEachUser;

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
        type:'newUser',
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
      desc:'Compra de cursos para novos membros de sua empresa que foram convidados a fazer parte da plataforma',
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
    // const lastView = new Date().getTime();
    // if (currentUser.access !== 'admin') batch.update(userRef,{statement:newCurrentUser.statement,})


  //create docs links and invites
  console.log('Create users',data)

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

  // if (data[0]?.isPrimaryAccount && data[0]?.access == 'client') {
  if (data[0].access == 'admin' || newCurrentUser.access == 'client') {
    const companyId = newCurrentUser.companyId
    const reduceType = 'users'
    let docIds = null;

    const reduce = await reduceRef.where("id", "==", companyId).where("reduceType", "==", reduceType).get();

    reduce.forEach(doc=>{
      if(doc.data().data.length < 200) docIds=doc.id
    })

    if (docIds === null) {
      docIds = `${reduceType}-${v4()}`
      await reduceRef.doc(docIds).set({
        id:companyId,
        reduceType:reduceType,
        data:[]
      })
    }

    batch.update(reduceRef.doc(docIds),{data:fb.firestore.FieldValue.arrayUnion(...reduceData)})
  }

  //commit final
  await batch.commit()

  return {data,newCurrentUser,actualUser}
}

export function useCreateUsers() {
  const notification = useNotification()
  const { currentUser,setCurrentUser } = useAuth()
  const mutation = useSendEmail()

  return useMutation(async(data)=>setUsers(data,currentUser), { //data = array of users {}
    onSuccess: (_data) => {
      notification.success({message:'Usuários criados com sucesso!'}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
      const {data, newCurrentUser, actualUser} = _data

      const isSameUser = newCurrentUser.uid === actualUser.uid
      if (isSameUser) setCurrentUser(newCurrentUser)

      const haveURL = data.map(item => {
        return item?.link
      }).filter(i=>i).length > 0

      //send email

      data.map(item => {
        if (item?.email) {
          const emailOptions = {
            subject:'Cursos EAD - REALIZA',
            html:`
            <div>
              <p>
                <b>Seja Bem-vindo</b>
                você foi convidade para se cadastrar na plataforma RealizaEAD
                <br/>
              </p>
              <p>
                Link de acesso para se cadastrar:
                <a href="https://realizaconsultoria.netlify.app/login?email=${item.email}" >
                  www.realizaconsultoria.com.br
                </a>
              </p>
              <p>Qualquer dúvida, entre em contato.</p>
            </div>
            `
          }

          mutation.mutateAsync({...emailOptions,email:item.email})
        }
      })


      if (haveURL) notification.modal({
        title: 'Sucesso',
        icon:'success',
        text:'Seu link compartilhavel foi criado e está disponivel nessa mesma página para que possa comparlihar com sua equipe',
        rightBnt:'Fechar',
        open:true,
      })

      if (!data[0]?.isPrimaryAccount) queryClient.setQueryData(['users', currentUser.uid], (oldData)=>[...data,...oldData])
      if (data[0]?.isPrimaryAccount) queryClient.setQueryData('clients', (oldData)=>[...data,...oldData])
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
