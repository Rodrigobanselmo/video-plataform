/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { AscendentObject } from '../../../../../../helpers/Sort';
import { useNotification } from '../../../../../../context/NotificationContext';


const EpiView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};
  cursor: pointer;

  &:hover {
    opacity: 0.6;
    background-color: #55555509;
  }

  p {
    padding-right: 20px;
    width: 100%;
  }

  &.group {
    padding-top:20px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
    margin-bottom:1px;
    padding-bottom:5px;
    p {
      color:${({ theme }) => theme.palette.text.secondary};
      font-size:13px;
    }
  }

  &.last {
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
  }
`;

const Check = styled(Checkbox)`
  height: 35px;
  width: 35px;
`;

export function SubCursosSideBar({ email, hasSubCurso, check, isAdmin, curso, setCursos, cursos, setPermissions, permissions,onQuantity }) {
  const EPI = [
    { name: 'Luva', id: 1, price:1},
    { name: 'Bota', id: 2 , price:1},
    { name: 'Capacete', id: 3 , price:1},
    { name: 'Cinto de segunraça', id: 4 , price:1},
    { name: 'Luva Quimica', id: 5 , price:1},
    { name: 'Luva aprova de fogo', id: 6 , price:2},
    { name: 'Luva de plastico', id: 7 , price:2},
    { name: 'Óculos protetor', id: 8 , price:2},
    { name: 'Óculos UV', id: 9 , price:2},
    { name: 'Capacete de chumbo', id: 0 , price:2},
    { name: 'Luva', id: 10 , price:2},
    { name: 'Bota 1', id: 20 , price:2},
    { name: 'Capacete 1', id: 30 , price:3},
    { name: 'Cinto de segunraça 1', id: 40 , price:3},
    { name: 'Luva Quimica 1', id: 50 , price:3},
    { name: 'Luva aprova de fogo 1', id: 60 , price:3},
    { name: 'Luva de plastico 1', id: 70 , price:3},
    { name: 'Óculos protetor 1', id: 80 , price:3},
    { name: 'Óculos UV 1', id: 90 , price:3},
    { name: 'Capacete de chumbo 1', id: 11 , price:3},
  ];

  const notification  = useNotification();

  const handleEPICheck = (event, cursoId, epi, itemQuantity, price, onQuantity,onItemQuantity,) => {

    if (itemQuantity <= 0 && event.target.checked) {
      return notification.warn({message:'Você não possui mais unidades deste curso',modal:true})
    }

    const newPermission = { ...permissions };
    const newData = { ...cursos };
    newData[`${email.index}--${cursoId}--epi`] = newData[`${email.index}--${cursoId}--epi`] ? newData[`${email.index}--${cursoId}--epi`] : []
    console.log('event,event', event);

    console.log('epi', epi);
    if (event.target.checked)
      newData[`${email.index}--${cursoId}--epi`] = [
        ...newData[`${email.index}--${cursoId}--epi`],
        epi,
      ];
    if (!event.target.checked)
      newData[`${email.index}--${cursoId}--epi`] = [
        ...newData[`${email.index}--${cursoId}--epi`].filter((i) => i.id !== epi.id),
      ];

    newPermission[`quantity--${cursoId}`] = onQuantity(newData);
    newPermission[`quantity--${cursoId}--${price}`] = onItemQuantity(newData);
    setPermissions(newPermission);
    setCursos(newData);
  };


  return (
    <>
      {hasSubCurso &&
        <Collapse unmountOnExit in={check}>
          {[1,2,3].map(price => {

            function onItemQuantity(cursos) {
              // if (isAdmin) return 'Infinito' // ?infinito

              let count = 0;
              let countQuantity = 0;

              Object.keys(cursos).map((k) => {
                console.log('k',k)
                if (
                  k.split('--').length === 3 &&
                  k.includes(curso.id) &&
                  cursos[k]
                ) {
                  cursos[k].map(episData=>{
                    const epiItem = EPI[EPI.findIndex(i=>i.id == episData.id)]
                    if (epiItem && epiItem.price == price) count += 1;
                  })
                }

              });

              curso?.data && curso.data.map((dt) => {
                if (dt.price == price) countQuantity += dt.quantity;
              });
              console.log('countQuantity',countQuantity,count)
              return countQuantity - count;

            }

            const itemQuantity = onItemQuantity(cursos);
            const EPIMap = EPI.filter(i=>i.price == price).sort((a, b) => AscendentObject(a, b, 'name'));

            if (EPIMap.length === 0) return null
            return (
              <div key={String(price)}>
                <EpiView className={'group'}>
                  <p>Grupo {price} (unidades: {itemQuantity})</p>
                </EpiView>
                {EPIMap.map((epi) => {
                    const checkEPI = Boolean(
                      cursos[`${email.index}--${curso.id}--epi`] &&
                        cursos[`${email.index}--${curso.id}--epi`].findIndex(i=>i.id==epi.id) != -1,
                    );

                    return (
                      <EpiView
                        key={String(epi.id)}
                        onClick={() =>
                          handleEPICheck(
                            { target: { checked: !checkEPI } },
                            curso.id,
                            epi,
                            itemQuantity,
                            price,
                            onQuantity,
                            onItemQuantity,
                          )
                        }
                      >
                        <p>{epi.name}</p>
                        <Check
                          size="small"
                          checked={checkEPI}
                          // onChange={(e) => handleEPICheck(e, curso.id, epi, itemQuantity)}
                          color="primary"
                        />
                      </EpiView>
                    );
                  },
                )}
              </div>
            )
          })}
        </Collapse>
      }
    </>
  );
}
