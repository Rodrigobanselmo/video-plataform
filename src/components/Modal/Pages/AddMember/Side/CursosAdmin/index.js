/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import { useAuth } from '../../../../../../context/AuthContext';
import { useNotification } from '../../../../../../context/NotificationContext';
import { queryClient } from '../../../../../../services/queryClient';
import { SubCursosSideBarAdmin } from '../SubCursosAdmin';
import TextField from '@material-ui/core/TextField';

const InputNumber = styled.input`
  &::-webkit-inner-spin-button {
    opacity: 1
  }
  width:100%;
`;


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
  margin-top: 10px;
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
  div.quantity {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    align-self: center;
    width: fit-content;
    margin-left:-45px;
  }

  h1 {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export function CursosSideBarAdmin({ email, isAdmin, setCursos, cursos, setPermissions, permissions }) {

  const { currentUser } = useAuth();
  const notification  = useNotification();

  const cursosAllData = queryClient.getQueryData('cursos');
  const cursosUserData = isAdmin ?cursosAllData.filter(i=>i?.modules):currentUser?.availableCursos;

  const handleCheck = (event, cursoId, quantity, onQuantity, hasSubCurso) => {

    const newData = { ...cursos };
    newData[`${email.index}--${cursoId}`] = event.target.checked;
    if (event.target.checked) newData[`${email.index}--${cursoId}--epi`] = [];
    if (!event.target.checked) delete newData[`${email.index}--${cursoId}--epi`];

    console.log('newData', newData);
    setCursos(newData);
  };

  const handleAddInputCount = (event, cursoId, quantity, onQuantity, hasSubCurso) => {
    const newData = { ...cursos };
    newData[`${email.index}--${cursoId}`] = event.target.value;
    console.log('newData', newData);
    setCursos(newData);
  };

  return (
    <>
    {cursosUserData ?
        cursosUserData.map((item) => {
          const curso = item;
          const cursoAll = cursosAllData[cursosAllData.findIndex(i=>i.id == item.id)]
          const cursoImage = cursoAll?.image;
          const hasSubCurso = !!cursoAll?.subCursos
          const check = cursos[`${email.index}--${item.id}`];

          function onQuantity() {
            return 'Infinito'
          }
          const quantity = 'Infinito';

          return (
            <>
              <ItemCurso image={cursoImage}>
                <div className="image" alt={curso.name} />
                <h1>{curso.name}</h1>
                <p>
                  {quantity} <span>un. restantes</span>
                </p>
                {hasSubCurso? (
                  <div className="checkbox">
                    <Check
                      size="small"
                      checked={Boolean(check)}
                      onChange={(e) => handleCheck(e, item.id, quantity, onQuantity, hasSubCurso)}
                      color="primary"
                    />
                  </div>
                ) : (
                  <div className="quantity">
                    <span>Quantidade:</span>
                    <InputNumber
                      type='number'
                      placeholder='0'
                      onChange={(e)=>handleAddInputCount(e,curso.id)}
                      value={check}
                      min="0"
                      max="999"
                    />
                  </div>
                )}
              </ItemCurso>

              <SubCursosSideBarAdmin
                email={email}
                hasSubCurso={hasSubCurso}
                check={check}
                isAdmin={isAdmin}
                curso={curso}
                setCursos={setCursos}
                cursos={cursos}
                setPermissions={setPermissions}
                permissions={permissions}
                onQuantity={onQuantity}
              />

            </>
          );
        })
      : null}
    </>
  );
}
