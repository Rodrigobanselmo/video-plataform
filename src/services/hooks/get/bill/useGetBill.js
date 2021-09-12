import { useQuery } from 'react-query';
import { useAuth } from '../../../../context/AuthContext';
import { db } from '../../../../lib/firebase.prod';

export async function getStatement() {
  const billRef = db.collection('bill');
  const billResponse = await billRef
    .orderBy('lastTouch', 'desc')
    .limit(10)
    .get();

  const bill = [];
  const lastVisible = billResponse.docs[billResponse.docs.length - 1];

  billResponse.forEach(function (doc) {
    bill.push({ ...doc.data() });
  });

  return [...bill, lastVisible];
}

export function useGetBill() {
  return useQuery('bill', () => getStatement(), {
    staleTime: 1000 * 60 * 60 * 1,
  });
}
