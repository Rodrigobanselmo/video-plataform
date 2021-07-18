/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { BreakLineText } from '../../../helpers/StringHandle';
import { CardView } from './styles';

interface Props extends React.ComponentPropsWithoutRef<typeof CardView> {
  image: string;
  title: string;
  text: string;
  alt: string;
  small?: boolean;
  onClick: () => void;
}

export const CardButton = ({
  onClick,
  image,
  title,
  text,
  alt = 'image',
  small = false,
  ...rest
}: Props) => {
  return (
    <CardView small={small} {...rest} onClick={onClick}>
      <img src={image} alt={alt} />
      <p className="title">
        <strong>{title}</strong>
      </p>
      <BreakLineText className="text">{text}</BreakLineText>
    </CardView>
  );
};

// interface Props extends React.HTMLAttributes<HTMLDivElement> {
//   image: string;
//   title: string;
//   text: string;
//   alt: string;
//   small?: boolean;
//   onClick: () => void;
// }
