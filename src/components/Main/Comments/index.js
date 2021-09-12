import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { db, fb } from '../../../lib/firebase.prod';
import { queryClient } from '../../../services/queryClient';
import { AvatarView } from '../Avatar';
import { Comment } from './comment';
import { TextComment } from './text';

const Button = styled.button`
  padding: 5px 0.8rem;
  border: none;
  background-color: ${({ theme }) => theme.palette.primary.light};
  font-weight: bold;
  font-size: 1rem;
  border-radius: 5px;
  color: white;
  align-self: flex-end;
  margin-top: -10px;
`;

export function Comments({ curso }) {
  const { currentUser } = useAuth();
  const ref = useRef(null);
  // const [data, setData] = useState([]);
  const commentsRef = db.collection('comments');
  const { moduleId, classId } = useParams();

  const { data } = useQuery(
    ['comments', moduleId, classId],
    async () => {
      const data = await commentsRef
        .where('moduleId', '==', moduleId)
        .where('classId', '==', classId)
        .get();

      const array = [];

      data.forEach(function (doc) {
        array.push({ ...doc.data() });
      });

      return array;
    },
    {
      staleTime: 1000 * 60 * 60 * 1, // 1 hora
    },
  );

  useEffect(() => {
    const getData = async () => {};
    getData();
  }, [moduleId, classId]);

  const onSendMessage = () => {
    ref.current.onSendMessage();
    if (ref.current.data.msg)
      queryClient.setQueryData(['comments', moduleId, classId], (dt) => [
        ref.current.data,
        ...dt,
      ]);
  };

  const isAdmin =
    (curso &&
      curso.professionals.some(
        (profile) => profile.userId === currentUser.uid,
      )) ||
    currentUser.permission.includes('ea') ||
    currentUser.permission.includes('su');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Comentários e Dúvidas</h2>
      <Comment textRef={ref} curso={curso} />
      <Button onClick={onSendMessage}>Enviar</Button>
      <p style={{ margin: '1rem 0' }}>últimos comentários</p>
      {data &&
        data.map((item, index) => {
          return (
            <>
              <TextComment
                isAdmin={isAdmin}
                curso={curso}
                hasResponse={item?.response}
                mb={item?.response ? 0 : 20}
                data={item}
                isYourMessage={item.uid === currentUser.uid}
              />
              {item?.response && (
                <TextComment
                  mb={20}
                  isResponse
                  data={{
                    msg: item?.response && item?.response?.msg,
                    created_at: item?.response && item?.response?.created_at,
                    name: '@support',
                    photoURL: '/images/iconRealiza.png',
                  }}
                />
              )}
            </>
          );
        })}
    </div>
  );
}
