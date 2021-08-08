/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { ReactNode } from 'react';
import { BreakLineText } from '../../../helpers/StringHandle';
import { CardView } from './styles';

interface Props extends React.ComponentPropsWithoutRef<typeof CardView> {
  children: ReactNode;
  small?: boolean;
}

export const CardButtonHorizontal = ({
  small = false,
  children,
  ...rest
}: Props) => {
  return (
    <CardView small={small} {...rest}>
      {children}
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
