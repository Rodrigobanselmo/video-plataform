/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { AscendentObject } from '../../../../../../helpers/Sort';
import { useNotification } from '../../../../../../context/NotificationContext';
import { EPIs } from '../../../../../../constants/geral';
import { useSellingData } from '../../../../../../context/data/SellingContext';


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

const SubCursosSideBarComponent = ({ hasSubCurso, check, isAdmin, curso }) => {

  const notification  = useNotification();
  const { fieldEdit, cursos, setCursos, setPrices, onCalcUserPrice } = useSellingData()

  const EPI  = EPIs.sort((a, b) => AscendentObject(a, b, 'name'));

  const handleEPICheck = (event, cursoId, epi,) => {


    const newData = { ...cursos };
    newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`] = newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`] ? newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`] : []

    if (event.target.checked)
      newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`] = [
        ...newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`],
        epi,
      ];

    if (!event.target.checked)
      newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`] = [
        ...newData[`${fieldEdit.index}--${cursoId}--${curso.name}--epi`].filter((i) => i.id !== epi.id),
      ];

    setPrices(onCalcUserPrice(newData));
    setCursos(newData);
  };


  return (
    <>
      {hasSubCurso &&
        <Collapse unmountOnExit in={check}>
          {/* {[1,2,3].map(price => {

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
                </EpiView> */}
                {EPI.map((epi) => {
                    const checkEPI = Boolean(
                      cursos[`${fieldEdit.index}--${curso.id}--${curso.name}--epi`] &&
                        cursos[`${fieldEdit.index}--${curso.id}--${curso.name}--epi`].findIndex(i=>i.id==epi.id) != -1,
                    );

                    return (
                      <EpiView
                        key={String(epi.id)}
                        onClick={() =>
                          handleEPICheck(
                            { target: { checked: !checkEPI } },
                            curso.id,
                            epi,
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
              {/* </div>
            )
          })} */}
        </Collapse>
      }
    </>
  );
};

export const SubCursosSideBar = React.memo(SubCursosSideBarComponent)
