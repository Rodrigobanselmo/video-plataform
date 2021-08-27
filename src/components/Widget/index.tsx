/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  setBadgeCount,
  isWidgetOpened,
  toggleWidget,
} from 'react-chat-widget';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, fb } from '../../lib/firebase.prod';

import '../../styles/widget.css';

interface IMessage {
  msg: string;
  type: string;
}

interface INotifications {
  missing: number;
  name: string;
  email: string;
  photoURL: string;
  uid: string;
  data: Array<IMessage>;
}

export const WidgetComponent: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const valueRef = useRef<INotifications | undefined>();
  const chatRef = db
    .collection('users')
    .doc(currentUser?.uid)
    .collection('notifications')
    .doc('chat');
  // React.useEffect(() => {
  //   if (!location.pathname.includes('admin')) {
  //     addResponseMessage('1');
  //     addUserMessage('1');
  //     addResponseMessage('2');
  //     addUserMessage('2');
  //     setBadgeCount(0);
  //     addResponseMessage('3');
  //     addResponseMessage('4');
  //     addUserMessage('3');
  //     addUserMessage('4');
  //   }
  // }, []);

  useEffect(() => {
    if (
      !currentUser ||
      (currentUser?.permission &&
        (currentUser.permission.includes('ea') ||
          currentUser.permission.includes('su')))
    )
      return;

    const unsubscribe = chatRef.onSnapshot((doc) => {
      // if (!valueRef.current) {
      // }

      const notifications = doc.data() as INotifications | null;
      const readNotifications = notifications?.data ?? [];

      if (valueRef.current) {
        readNotifications.splice(0, valueRef.current.data.length);
      }

      readNotifications.map((message) => {
        if (message.type === 'user' && !valueRef.current)
          addUserMessage(message.msg);
        else if (message.type !== 'user') addResponseMessage(message.msg);
      });
      setBadgeCount(notifications?.missing ?? 0);

      valueRef.current = doc.data() as INotifications;
    });

    // remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, []);

  const handleNewUserMessage = (newMessage: string): void => {
    console.log(`New message incoming! ${newMessage}`);

    const message = { msg: newMessage, type: 'user' };
    console.log('valueRef.current', valueRef.current);

    if (!valueRef.current) {
      const chatData = {
        missing: 0,
        name: currentUser.name,
        email: currentUser.email,
        uid: currentUser.uid,
        photoURL: currentUser?.photoURL,
        data: [message],
      };

      chatRef.set(chatData);
      valueRef.current = chatData;
    }
    if (valueRef.current)
      chatRef.update({
        missing: 0,
        name: currentUser.name,
        email: currentUser.email,
        photoURL: currentUser?.photoURL,
        data: fb.firestore.FieldValue.arrayUnion(message),
      });
    // Now send the message throught the backend API
  };

  const handleWidgetClick = (): void => {
    if (valueRef.current?.missing) {
      chatRef.update({
        missing: 0,
      });
    }
  };

  // const sendMessage = (): void => {
  //   const message = { msg: `${Math.random()}`, type: 'support' };
  //   chatRef.update({
  //     missing: fb.firestore.FieldValue.increment(1),
  //     data: fb.firestore.FieldValue.arrayUnion(message),
  //   });
  // };

  if (
    !currentUser ||
    (currentUser?.permission &&
      (currentUser.permission.includes('ea') ||
        currentUser.permission.includes('su'))) ||
    location.pathname.includes('admin') ||
    !location.pathname.includes('app') ||
    location.pathname.includes('notification')
  )
    return null;

  return (
    <>
      {/* <button type="button" onClick={sendMessage}>
        okuhuihuihuihiuhui
      </button> */}
      <div onClick={handleWidgetClick}>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          profileAvatar="/images/iconRealiza.png"
          title="Suporte"
          subtitle="Fale com nosso suporte e tire suas dúvidas"
          showTimeStamp={false}
        />
      </div>
    </>
  );
};
