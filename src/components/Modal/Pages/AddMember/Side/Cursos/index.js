/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import { useAuth } from '../../../../../../context/AuthContext';
import { useNotification } from '../../../../../../context/NotificationContext';
import { queryClient } from '../../../../../../services/queryClient';
import { SubCursosSideBar } from '../SubCursos';
import TextField from '@material-ui/core/TextField';

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

  h1 {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export function CursosSideBar({ email, isAdmin, setCursos, cursos, setPermissions, permissions }) {

  const { currentUser } = useAuth();
  const notification  = useNotification();

  const cursosAllData = queryClient.getQueryData('cursos');
  const cursosUserData = !isAdmin ?cursosAllData.filter(i=>i?.modules):currentUser?.availableCursos; // ?Infinito
  // const cursosUserData = isAdmin ?cursosAllData.filter(i=>i?.modules):currentUser?.availableCursos;

  const handleCheck = (event, cursoId, quantity, onQuantity, hasSubCurso) => {

    if (quantity !== 'Infinito' && quantity <= 0 && event.target.checked) return notification.warn({message:'Você não possui mais unidades deste curso',modal:true})

    const newPermission = { ...permissions };
    const newData = { ...cursos };
    if (hasSubCurso) {
      newData[`${email.index}--${cursoId}`] = event.target.checked;
      if (event.target.checked) newData[`${email.index}--${cursoId}--epi`] = [];
      if (!event.target.checked) delete newData[`${email.index}--${cursoId}--epi`];
    } else {
      newData[`${email.index}--${cursoId}`] = event.target.checked;
    }

    newPermission[`quantity--${cursoId}`] = onQuantity(newData);

    console.log('newData', newData);
    console.log('newPermission', newPermission);

    setPermissions(newPermission);
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
          const check = Boolean(cursos[`${email.index}--${item.id}`]);

          function onQuantity(cursos) {
            // if (isAdmin) return 'Infinito' // ?Infinito se aqui vier arrai de cursos all
            let count = 0;
            let countQuantity = 0;
            if (hasSubCurso) { //se tiver sub cursos como epi
              Object.keys(cursos).map((k) => {
                console.log('k',k)
                if (
                  k.split('--').length === 3 &&
                  k.includes(item.id) &&
                  cursos[k]
                )
                  count += cursos[k].length;
              });

              curso?.data && curso.data.map((dt) => {
                console.log('dt',dt)
                countQuantity += dt.quantity;
              });
              console.log('countQuantity',countQuantity,count)

              if (String(countQuantity).includes('Infinito')) return 'Infinito'
              return countQuantity - count;
            } else {
              console.log('curso',cursos)
              Object.keys(cursos).map((k) => {
                if (
                  k.split('--').length === 2 &&
                  k.split('--')[1] == (curso.id) &&
                  cursos[k]
                ) {
                  console.log('curso.id',curso.id)
                  count += 1;
                }
              });
              if (curso.quantity === 'Infinito') return curso.quantity
              return curso.quantity - count;
            }
          }

          const quantity = onQuantity(cursos);

          return (
            <div key={curso.id}>
              <ItemCurso image={cursoImage}>
                <div className="image" alt={curso.name} />
                <h1>{curso.name}</h1>
                <p>
                  {quantity} <span>un. restantes</span>
                </p>
                <div className="checkbox">
                  <Check
                    size="small"
                    checked={check}
                    onChange={(e) => handleCheck(e, item.id, quantity, onQuantity, hasSubCurso)}
                    color="primary"
                  />
                </div>
              </ItemCurso>
              <SubCursosSideBar
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

            </div>
          );
        })
      : null}
    </>
  );
}
