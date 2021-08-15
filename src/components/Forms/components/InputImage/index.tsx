/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { FiCamera } from 'react-icons/fi';
import ImageIcon from '@material-ui/icons/Image';
import { useNotification } from '../../../../context/NotificationContext';

const AvatarInput = styled.div`
  position: relative;
  align-self: center;
  width: fit-content;
  img {
    width: 280px;
    height: 186px;
    border-radius: 10%;
    cursor: pointer;
    object-fit: cover;
  }
  div {
    width: 186px;
    height: 186px;
    border-radius: 10%;
    background: ${({ theme }) => theme.palette.background.paper};
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    border: 0;
    right: -10px;
    bottom: -10px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(
      -10deg,
      ${({ theme }) => theme.palette.primary.main},
      ${({ theme }) => theme.palette.primary.light}
    );
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.primary.contrastText};
    }
    &:hover {
      filter: brightness(0.95);
    }
  }
`;

interface IInputImage {
  imageURL: string | null;
  onHandleSelect: (image: File) => void;
}

export const InputImage = ({
  imageURL,
  onHandleSelect,
}: IInputImage): React.ReactElement => {
  const notification = useNotification();

  const onInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 1 * 10 ** 6)
        return notification.error({
          message: 'Sua imagem não pode ser maior que 1 MB',
        });
      onHandleSelect(event.target.files[0]);
    }
  };

  function onClick() {
    document.getElementById('avatarInput')?.click();
  }

  return (
    <AvatarInput>
      {imageURL ? (
        <img onClick={onClick} src={imageURL} alt="perfil_photo" />
      ) : (
        <div onClick={onClick}>
          <ImageIcon style={{ fontSize: 130, transform: 'translateY(-5px)' }} />
        </div>
      )}
      <label htmlFor="avatar" id="avatarInput">
        <FiCamera />
        <input
          accept="image/*"
          type="file"
          id="avatar"
          onChange={onInputFileChange}
        />
      </label>
    </AvatarInput>
  );
};
