import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../../context/AuthContext';
import { DateProvider } from '../../../../helpers/DateProvider/implementation';
import { db, fb } from '../../../../lib/firebase.prod';
import { AvatarView } from '../../Avatar';

export const TextStyledArea = styled.p`
  width: 100%;
  padding: 0.5rem 0.5rem 0.8rem 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.background.secondary};
  box-sizing: border-box;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.palette.background.line};
  margin: 0 0 10px 0;
  border-radius: 6px;
  margin-left: 10px;

  > div {
    display: flex;
    > p {
      opacity: 0.7;
      font-size: 0.8rem;
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
    }
    p.date {
      display: inline-block;
      margin-left: auto;
    }
  }

  @media screen and (max-width: 1100px) {
    margin-left: 0px;
  }
`;

export function TextComment({ isResponse, data, mb }) {
  const dateProvider = new DateProvider();

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        marginLeft: isResponse ? 60 : 0,
        marginBottom: mb,
      }}
    >
      <AvatarView
        onClick={() => {}}
        navbar
        style={{ marginLeft: 0 }}
        randomColor
        user={data}
      />
      <TextStyledArea>
        <div>
          <p style={{ width: '100%' }}>{isResponse ? '@suporte' : data.name}</p>
          <p className="date">
            {Intl.DateTimeFormat('pt-BR', {}).format(data.created_at)}
          </p>
        </div>
        {data.msg}
      </TextStyledArea>
    </div>
  );
}
