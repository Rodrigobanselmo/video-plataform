/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import { useAuth } from '../../../../../../context/AuthContext';
import { useNotification } from '../../../../../../context/NotificationContext';
import { queryClient } from '../../../../../../services/queryClient';
import { SubCursosSideBar } from '../SubCursos';
import TextField from '@material-ui/core/TextField';
import { useSellingData } from '../../../../../../context/data/SellingContext';
import { COMBOS } from '../../../../../../constants/geral';

const Check = styled(Checkbox)`
  height: 35px;
  width: 35px;
`;

const ItemCurso = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 5fr 35px;
  grid-template-rows: 1fr fit-content;
  grid-gap: 0 10px;
  margin-top: 0px;
  padding: 7px 0;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};

  div.image {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    background-image: url('${({ image }) => image}');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius:5px;
  }

  div.checkbox {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    align-self: center;
    height: 35px;
    width: 35px;
  }

  h1 {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
    padding-top: 2px;
  }

  > p {
    /* background-color: ${({ theme }) => theme.palette.status.success}; */
    color: ${({ theme }) => theme.palette.text.secondary};
    width:fit-content;
    padding: 2px 0px;
    font-weight: bold;
    font-size:0.75rem;
    /* opacity:0.3; */

    span {
      /* color: ${({ theme }) => theme.palette.status.warnD}; */
      /* color: ${({ theme }) => theme.palette.primary.main}; */
      font-size:0.85rem;
      margin-left:5px;
    }

  }
`;

export function CursosSideBar({ email, isAdmin }) {

  const { currentUser } = useAuth();
  const notification  = useNotification();
  const { fieldEdit, cursos, setCursos, setPrices, onCalcUserPrice } = useSellingData()


  const cursosAllData = queryClient.getQueryData('cursos');
  const cursosFullData = cursosAllData.filter(i=>i?.modules)
  // const cursosFullData = isAdmin ?cursosAllData.filter(i=>i?.modules):currentUser?.availableCursos;

  const handleCheck = (event, curso, hasSubCurso) => {

    const newData = { ...cursos };

    newData[`${fieldEdit.index}--${curso.id}--${curso.name}`] = event.target.checked;

    if (hasSubCurso) {
      if (event.target.checked) newData[`${fieldEdit.index}--${curso.id}--${curso.name}--epi`] = [];
      if (!event.target.checked) delete newData[`${fieldEdit.index}--${curso.id}--${curso.name}--epi`];
    }
    setPrices(onCalcUserPrice(newData))
    setCursos(newData);
  };

  return (
    <>
      {cursosFullData ? cursosFullData.map((curso) => {
        const cursoImage = curso?.image;
        const cursoName = curso?.name;

        const hasSubCurso = !!curso?.subCursos
        const combos = curso?.combos ?? []

        const isUniqueProduct = curso.combos.length === 1 ? 'Preço único:' : 'Preço inicial:'
        const check = Boolean(cursos[`${fieldEdit.index}--${curso.id}--${curso.name}`]);

        return (
          <div key={curso.id}>
            <ItemCurso image={cursoImage}>
              <div className="image" alt={cursoName} />
              <h1>{curso.name}</h1>
              <p>
                {isUniqueProduct}
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(combos[0].price)}
                </span>
              </p>
              <div className="checkbox">
                <Check
                  size="small"
                  checked={check}
                  onChange={(e) => handleCheck(e, curso, hasSubCurso)}
                  color="primary"
                />
              </div>
            </ItemCurso>
            <SubCursosSideBar
              hasSubCurso={hasSubCurso}
              check={check}
              isAdmin={isAdmin}
              curso={curso}
            />

          </div>
        );
      }) : null}
    </>
  );
}
