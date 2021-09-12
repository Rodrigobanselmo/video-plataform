import { useMutation } from 'react-query';
import { useAuth } from '../../../../context/AuthContext';
import { useLoaderDashboard } from '../../../../context/LoadDashContext';
import { AscendentObject } from '../../../../helpers/Sort';
import { db } from '../../../../lib/firebase.prod';
import { queryClient } from '../../../queryClient';

export async function getMoreClientUsers(limit) {
  const LIMIT = limit ? limit : 10;

  const billRef = db.collection('bill');

  const data = queryClient.getQueryData('bill');
  const lastVisible = data ? data[data.length - 1] : {};

  if (!lastVisible?._firestore) return [];

  const billResponse = await billRef
    .orderBy('lastTouch', 'desc')
    .startAfter(lastVisible)
    .limit(LIMIT)
    .get();

  const lastVisibleAgain = billResponse.docs[billResponse.docs.length - 1];

  const bill = [];

  billResponse.forEach(function (doc) {
    bill.push({ ...doc.data() });
  });

  return [...bill, lastVisibleAgain];
}

export function useGetMoreBill() {
  return useMutation(async (limit) => getMoreClientUsers(limit), {
    staleTime: 1000 * 60 * 60 * 1,
    onSuccess: (data) => {
      console.log(data);
      if (data.filter((i) => i).length > 0)
        queryClient.setQueryData('bill', (oldData) => [
          ...oldData.filter((i) => !i?._firestore),
          ...data,
        ]);
    },
  });
}
