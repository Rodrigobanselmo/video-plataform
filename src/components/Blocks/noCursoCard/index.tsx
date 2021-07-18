/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { BreakLineText } from '../../../helpers/StringHandle';
import { CardView } from './styles';

interface Props {
  image: string;
  title: string;
  text: string;
  alt: string;
  onClick: () => void;
}

export const CardButtofn = ({
  onClick,
  image,
  title,
  text,
  alt = 'image',
}: Props) => {
  return (
    <CardView onClick={onClick}>
      <img src={image} alt={alt} />
      <p className="title">
        <strong>{title}</strong>
      </p>
      <BreakLineText className="text">{text}</BreakLineText>
    </CardView>
  );
};
