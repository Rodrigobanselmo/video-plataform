import React from 'react';
import { Subtitle, Title } from './styles';

interface IHeader {
  title: string;
  text: string;
  mt?: number;
}

export const HeaderBlock = ({
  title,
  text,
  mt = 0,
}: IHeader): React.ReactElement => {
  return (
    <>
      <Title style={{ marginTop: `${mt}rem` }}>{title}</Title>
      <Subtitle>{text}</Subtitle>
    </>
  );
};
