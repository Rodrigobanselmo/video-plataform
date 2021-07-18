/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { CursoCard, BottomView, NameText } from './styles';

interface Props {
  image: string;
  title: string;
  text: string;
  onClick: () => void;
}

export const CardCurso = ({ onClick, image, title, text }: Props) => {
  return (
    <div style={{ width: 250 }}>
      <CursoCard imageURL={image} onClick={onClick}>
        <div className="backImage" />
        <div className="gradient" />
        <BottomView>
          <NameText>{title}</NameText>
        </BottomView>
      </CursoCard>
      <p
        style={{
          fontSize: '11px',
          color: '#000',
          zIndex: 10,
          textAlign: 'right',
          padding: 5,
          paddingRight: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};
