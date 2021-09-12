import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../../../../context/AuthContext';
import { db, fb } from '../../../../lib/firebase.prod';
import { AvatarView } from '../../Avatar';

export const TextStyledArea = styled.input`
  width: 100%;
  max-height: 500px;
  resize: none;
  padding: 15px 15px 24px 15px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.background.secondary};
  box-sizing: border-box;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.palette.background.line};
  margin: 0 0 20px 0;
  border-radius: 6px;
  margin-left: 10px;

  @media screen and (max-width: 1100px) {
    margin-left: 0px;
  }
`;

export function Comment({ curso, textRef }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState('');
  const { moduleId, classId } = useParams();

  useEffect(() => {});

  const chatRef = db
    .collection('comments')
    .doc(curso?.id)
    .collection('notifications')
    .doc('chat');

  const onSendMessage = async () => {
    if (!data.trim()) return null;
    const chatData = {
      name: currentUser.name,
      email: currentUser.email,
      uid: currentUser.uid,
      photoURL: currentUser?.photoURL,
      msg: data,
      classId,
      moduleId,
      response: false,
      created_at: new Date().getTime(),
    };
    console.log(curso?.id);
    try {
      await chatRef.update({
        email: curso.certificationEmail,
        name: curso.name,
        id: curso.id,
        data: fb.firestore.FieldValue.arrayUnion(chatData),
      });
    } catch (e) {
      await chatRef.set({
        email: curso.certificationEmail,
        name: curso.name,
        id: curso.id,
        data: [chatData],
      });
    }
    setData('');
  };

  useImperativeHandle(textRef, () => {
    return {
      onSendMessage,
      data: {
        name: currentUser.name,
        email: currentUser.email,
        uid: currentUser.uid,
        photoURL: currentUser.photoURL,
        msg: data.trim(),
        response: '',
      },
    };
  });

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <AvatarView
        onClick={() => {}}
        navbar
        style={{ marginLeft: 0 }}
        user={currentUser}
      />
      <TextStyledArea
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Escreva seu comentário aqui..."
      />
    </div>
  );
}
