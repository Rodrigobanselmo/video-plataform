/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { AscendentObject } from '../../../../../../helpers/Sort';
import { useNotification } from '../../../../../../context/NotificationContext';
import { BootstrapTooltip } from '../../../../../Main/MuiHelpers/Tooltip';

const InputNumber = styled.input`
  &::-webkit-inner-spin-button {
    opacity: 1
  }
  width:100%;
`;

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

export function SubCursosSideBarAdmin({ email, hasSubCurso, check, isAdmin, curso, setCursos, cursos, setPermissions, permissions,onQuantity }) {

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

  const handleAddInputSubCount = (event, cursoId, price) => {
    const newPermission = { ...permissions };
    newPermission[`quantity--${email.index}--${curso.id}--${price}`] = event.target.value;
    setPermissions(newPermission);
  };


  return (
    <>
      {hasSubCurso &&
        <Collapse unmountOnExit in={check}>
          {[1,2,3].map(price => {

            function onItemQuantity(cursos) {
              return 'Infinito'
            }

            const itemQuantity = onItemQuantity(cursos);
            const quantitySelected = permissions[`quantity--${email.index}--${curso.id}--${price}`]?permissions[`quantity--${email.index}--${curso.id}--${price}`]:'0';
            const allEpis = EPI.map(i=>{
              if (i.price === price) return i.name
            }).filter(i=>i).join(', ')
            return (
              <div key={String(price)}>
                <BootstrapTooltip title={allEpis}>
                  <EpiView className={'group'}>
                    <p>Grupo {price}</p>
                  </EpiView>
                </BootstrapTooltip>
                <div className="quantity">
                  <span>Quantidade:</span>
                  <InputNumber
                    type='number'
                    placeholder='0'
                    onChange={(e)=>handleAddInputSubCount(e,curso.id,price)}
                    value={quantitySelected}
                    min="0"
                    max="999"
                  />
                </div>
              </div>
            )
          })}
        </Collapse>
      }
    </>
  );
}
