/* eslint-disable no-plusplus */
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
  deleteMessages,
} from 'react-chat-widget';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db, fb } from '../../../lib/firebase.prod';

import '../../../styles/widget.css';

interface IUser {
  name?: string;
  email?: string;
  photoURL?: string;
}

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
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const valueRef = useRef<INotifications | undefined>();
  const numberOfMessages = useRef<number>(0);
  const { userId } = useParams<{ userId: string }>();
  const chatRef = db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .doc('chat');

  useEffect(() => {
    if (userId && !isWidgetOpened())
      setTimeout(() => {
        toggleWidget();
      }, 1000);
    if (!currentUser || !userId) return;

    const unsubscribe = chatRef.onSnapshot((doc) => {
      // if (!valueRef.current) {
      // }

      const notifications = doc.data() as INotifications | null;
      const readNotifications = notifications?.data ?? [];

      if (!valueRef.current)
        setUserInfo({
          name: notifications?.name,
          email: notifications?.email,
          photoURL: notifications?.photoURL,
        });

      if (valueRef.current) {
        readNotifications.splice(0, valueRef.current.data.length);
      }

      readNotifications.map((message) => {
        numberOfMessages.current += 1;
        console.log(message);
        if (message.type === 'user') addResponseMessage(message.msg);
        else if (message.type !== 'user' && !valueRef.current)
          addUserMessage(message.msg);
      });
      setBadgeCount(notifications?.missing ?? 0);

      valueRef.current = doc.data() as INotifications;
    });

    // remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => {
      console.log('clear');
      valueRef.current = undefined;
      for (let index = 0; index <= numberOfMessages.current; index++) {
        deleteMessages(numberOfMessages.current - index);
      }
      unsubscribe();
    };
  }, [userId]);

  const handleNewUserMessage = (newMessage: string): void => {
    const message = { msg: newMessage, type: 'sup' };
    console.log('valueRef.current', valueRef.current);

    if (valueRef.current)
      chatRef.update({
        missing: fb.firestore.FieldValue.increment(1),
        data: fb.firestore.FieldValue.arrayUnion(message),
      });
    // Now send the message throught the backend API
  };

  return (
    <>
      {/* <button type="button" onClick={sendMessage}>
        okuhuihuihuihiuhui
      </button> */}
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={userInfo?.photoURL}
        title={userInfo?.name ?? 'Usuário'}
        subtitle={userInfo?.email ?? 'email'}
        showTimeStamp={false}
      />
    </>
  );
};
