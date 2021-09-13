import React, { useEffect } from 'react';
import { db, auth, fb } from './lib/firebase.prod';
import { LogOut } from './services/firebaseAuth';

// const emailAdmin = 'realiza@gmail.com';
const emailAdmin = 'rodrigobanselmo@gmail.com';

export const Seed: React.FC = () => {
  const data = async (): Promise<void> => {
    const notificationsEmailRef = db.collection('notifications').doc('emails');
    const notificationsEmail = await notificationsEmailRef.get();
    if (!notificationsEmail.exists)
      await notificationsEmailRef.set({
        support_notifications: emailAdmin,
        certifications_signature: emailAdmin,
      });

    const notificationsActiveRef = db
      .collection('notifications')
      .doc('activeUsers');
    const notificationsActive = await notificationsActiveRef.get();
    if (!notificationsActive.exists)
      await notificationsActiveRef.set({
        data: [],
        answer: [],
      });

    // const notificationsAnswersRef = db
    //   .collection('notifications')
    //   .doc('answersUsers');
    // const notificationsAnswers = await notificationsAnswersRef.get();
    // if (!notificationsAnswers.exists)
    //   await notificationsAnswersRef.set({
    //     data: [],
    //   });
  };

  const users = async (): Promise<void> => {
    const responseEmail = await auth.fetchSignInMethodsForEmail(emailAdmin);
    console.log('responseEmail', responseEmail);

    if (responseEmail.length !== 0) return;

    const userData = await auth.createUserWithEmailAndPassword(
      emailAdmin,
      'qweqwe',
    );

    const userRef = db.collection('users').doc(userData?.user?.uid);
    await userRef.set({
      email: userData?.user?.email,
      uid: userData?.user?.uid,
      access: 'admin',
      companyId: 'realizaconsultoriaEAD',
      createdAt: new Date().getTime(),
      cursos: [],
      emailVerified: false,
      permission: ['ea', 'master', 'co'],
      status: 'Ativo',
      type: 'Admin',
    });
  };

  useEffect(() => {
    console.log('Start Seed');
    // LogOut();
    users();
    data();
  }, []);

  return (
    <div>
      <h1>seed succeeded</h1>
    </div>
  );
};
