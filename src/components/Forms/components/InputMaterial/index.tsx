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
import { AiTwotoneFolderOpen, AiFillFolderAdd } from 'react-icons/ai';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useNotification } from '../../../../context/NotificationContext';

const ContainerView = styled.div`
  margin-bottom: 20px;
  padding: 10px 20px;
  border: 2px dashed ${({ theme }) => theme.palette.background.line};
  border-radius: 20px;
  cursor: pointer;
`;

const AvatarInput = styled.div`
  position: relative;
  align-self: center;
  width: fit-content;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  div:not(.name) {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.background.paper};
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.name {
    left: 65px;
    bottom: 0px;
    flex-direction: row;
    display: flex;
    position: absolute;

    p {
      max-width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }
  label {
    position: absolute;
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    border: 0;
    right: 0px;
    bottom: 0px;
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

interface IInputMaterial {
  materialURL: [name: string, url: string];
  isLoading: boolean;
  onHandleSelect: (image: File) => void;
}

export const InputMaterial = ({
  materialURL,
  isLoading,
  onHandleSelect,
}: IInputMaterial): React.ReactElement => {
  const notification = useNotification();
  const [name, url] = materialURL;
  const onInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onHandleSelect(event.target.files[0]);
    }
  };
  function onDownload() {
    if (!name || !url) return null;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('target', '_blank');

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  }

  function onClick(doNothing?: boolean) {
    if (doNothing) return null;
    document.getElementById('newFileLabel')?.click();
  }

  return (
    <>
      <h3 style={{ marginBottom: 10 }}>Adicionar Material Didádico</h3>
      <ContainerView>
        <AvatarInput>
          {name ? (
            <div onClick={() => onClick()}>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <AiFillFolderAdd style={{ fontSize: 30 }} />
              )}
            </div>
          ) : (
            <div onClick={() => onClick()}>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <AiTwotoneFolderOpen style={{ fontSize: 30 }} />
              )}
            </div>
          )}
          <label htmlFor="newFile" id="newFileLabel">
            <AddIcon />
            <input
              accept="*"
              type="file"
              id="newFile"
              onChange={onInputFileChange}
            />
          </label>
          <div onClick={onDownload} className="name">
            <p>{name || 'Nenhum arquivo selecionado'}</p>{' '}
            {name && <GetAppIcon />}
          </div>
        </AvatarInput>
      </ContainerView>
    </>
  );
};
