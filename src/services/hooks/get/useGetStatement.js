import { useQuery } from 'react-query';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase.prod';

export async function getStatement(newUser) {
  const user = { ...newUser };
  if (!user) return [];

  const statementRef = db.collection('statement');
  const billReduce = db.collection('bill');

  let response = [];
  if (user?.companyId) {
    response = await statementRef
      .where('companyId', '==', user.companyId)
      .orderBy('created_at', 'desc')
      .limit(6)
      .get();
  } else {
    response = await statementRef
      .where('customerId', '==', user.uid)
      .orderBy('created_at', 'desc')
      .limit(6)
      .get();
  }
  const arrayData = [];
  console.log('refreshLink');

  response.forEach(function (doc) {
    arrayData.push({ ...doc.data() });
  });

  //get bill
  const uid = user?.companyId || user?.customerId || user?.uid;
  const bill = await billReduce.where('id', '==', uid).get();

  let billingData = {
    id: uid,
    openValue: 0,
    lastPayment: new Date().getTime(),
    due: new Date().getTime() + 1000 + 60 + 60 * 24 * 28,
  };

  bill.forEach((doc) => {
    billingData = doc.data();
  });

  return { statement: arrayData, bill: billingData };
}

export function useGetStatement(user) {
  return useQuery(['statement', user.companyId], () => getStatement(user), {
    staleTime: 1000 * 60 * 60 * 1,
  });
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
