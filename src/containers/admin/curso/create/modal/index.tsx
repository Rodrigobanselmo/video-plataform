/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CircularProgress } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ButtonForm } from '../../../../../components/Dashboard/Components/Form/comp';
import { ContinueButton } from '../../../../../components/Main/MuiHelpers/Button';
import { ModalNormal } from '../../../../../components/Modal/Modal';
import { useCursos } from '../../../../../services/hooks/get/useCursos';
import { useCreateCurso } from '../../../../../services/hooks/set/useCreateCurso';

const Container = styled.div`
  min-width: 500px;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

interface ICurso {
  image?: string;
}

const ItemCurso = styled.div<ICurso>`
  display: flex;
  width: 100%;
  flex: 1;
  gap: 0 10px;
  /* margin-top: 10px; */
  padding: 7px 0;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};
  cursor: pointer;
  background-color: transparent;
  transition: background-color 0.3 ease;
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.default};
  }

  div.image {
    background-image: url('${({ image }) => image}');
    background-color: ${({ theme }) => theme.palette.background.inactive};
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 5px;
    height: 50px;
    width: 120px;
  }

  h1 {
    font-size: 1rem;
    padding-right: 20px;
    width: 100%;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

interface IModal {
  handleOnClose: (close?: boolean, curso?: any) => void;
  handleSelectCourse: (data?: any) => void;
  open: boolean;
}

interface ICursoData {
  image: string;
  name: string;
  id: string;
  editorState?: boolean;
  published?: boolean;
}

export const ModalCreateCurso = ({
  handleOnClose,
  handleSelectCourse,
  open,
}: IModal): JSX.Element => {
  const { data, isLoading } = useCursos();
  const mutation = useCreateCurso();

  const onClick = (curso: any): void => {
    if (data)
      handleSelectCourse([
        curso,
        data.find((i) => i.id === curso.id && i.editorState),
      ]);
  };

  const handleCreateCurso = async (curso: any): Promise<void> => {
    const id = v4();
    const initialData = {
      main: {
        id,
        published: 0,
        daysToExpire: '',
        duration: '',
        accessTimeAfter: '',
        validSignature: false,
        answerEmail: '',
        certificationEmail: '',
        name: '',
        image: '',
        modules: [],
        professionals: [],
      },
      draft: {
        id,
        editorState: true,
        text: { blocks: [], entityMap: {} },
        published: { blocks: [], entityMap: {} },
      },
    };

    const newCurso = await mutation.mutateAsync(initialData);
    handleOnClose(true, newCurso);
  };

  return (
    <ModalNormal
      open={open}
      onClose={handleOnClose}
      title="Gerenciar Cursos"
      padding={false}
      icon={false}
    >
      <Container>
        {!data ? (
          <CircularProgress />
        ) : (
          !!data &&
          data.map((curso: ICursoData) => {
            const cursoImage = curso?.image;
            if (curso?.editorState) return null;
            return (
              <ItemCurso
                onClick={() => onClick(curso)}
                key={curso.id}
                image={cursoImage}
              >
                <div className="image" />
                <h1>{curso.name}</h1>
                <p>
                  <span>{curso?.published ? 'PUBLICADO' : 'INATIVO'}</span>
                </p>
              </ItemCurso>
            );
          })
        )}
      </Container>
      <div style={{ width: '100%' }}>
        <ButtonForm
          primary
          type="submit"
          loading={mutation.isLoading}
          onClick={handleCreateCurso}
        >
          Criar Novo Curso
        </ButtonForm>
      </div>
    </ModalNormal>
  );
};
