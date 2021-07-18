/* eslint-disable react/jsx-curly-newline */
import React from 'react';
// import AddModal, {Type,Form} from './comp'
// import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import { Collapse } from '@material-ui/core';
import { useAuth } from '../../../../../context/AuthContext';
import { InputEnd } from '../../../../Main/MuiHelpers/Input';
import { NumberFormatCPF } from '../../../../../lib/textMask';
import { AscendentObject } from '../../../../../helpers/Sort';
import { SIGN } from '../../../../../routes/routesNames';
import { useNotification } from '../../../../../context/NotificationContext';
import { queryClient } from '../../../../../services/queryClient';

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

  h1 {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const SideEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  overflow-y: auto;
  max-height: 85vh;
  border-radius: 20px;

  div.selected {
    display: flex;
    flex-direction: column;
    width: 100%;

    > h2 {
      font-size: 1.3rem;
      color: ${({ theme }) => theme.palette.text.primary};
      margin-bottom: ${({ isUrl }) => (isUrl ? 10 : 0)}px;
    }
    > p {
      font-size: 1rem;
      color: ${({ theme }) => theme.palette.text.primary};
      margin-bottom: 10px;
    }
  }

  .none {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export function SideEmail({ email, data, setData, setCursos, cursos }) {
  // div className='selected'
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
  const EPI_ID = 'dyuwqf2';
  const { currentUser } = useAuth();
  const notification  = useNotification();
  const cursosAllData = queryClient.getQueryData('cursos');
  const cursosUserData = currentUser?.cursos;
  const isUrl = email.value && email.value.includes(SIGN);

  const handleChange = (value, name) => {
    const newData = { ...data };
    newData[`${email.index}--${name}`] = value;

    setData(newData);
  };

  const handleCheck = (event, cursoId, quantity) => {

    if (quantity <= 0 && event.target.checked) return notification.warn({message:'Você não possui mais unidades deste curso',modal:true})

    const newData = { ...cursos };
    if (cursoId === EPI_ID) {
      newData[`${email.index}--${cursoId}`] = event.target.checked;
      if (event.target.checked) newData[`${email.index}--${cursoId}--epi`] = [];
      if (!event.target.checked) delete newData[`${email.index}--${cursoId}--epi`];
    } else {
      newData[`${email.index}--${cursoId}`] = event.target.checked;
    }

    console.log('newData', newData);
    setCursos(newData);
  };

  const handleEPICheck = (event, cursoId, epi, itemQuantity) => {

    if (itemQuantity <= 0 && event.target.checked) {
      return notification.warn({message:'Você não possui mais unidades deste curso',modal:true})
    }

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

    setCursos(newData);
  };

  return (
    <SideEmailContainer isUrl={isUrl}>
      {email?.value ? (
        <div className="selected">
          <h2>{isUrl ? 'Link compartilhavel' : 'e-mail'}</h2>
          {!isUrl && <p className="oneLine">{email.value}</p>}
          <InputEnd
            option
            width="100%"
            onChange={({ target }) => handleChange(target.value, 'name')}
            inputProps={{ style: { textTransform: 'capitalize' } }}
            value={data[`${email.index}--name`] ?? ''}
            size="small"
            labelWidth={120}
            label="Nome do aluno"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            variant="outlined"
          />
          <InputEnd
            option
            value={data[`${email.index}--cpf`] ?? ''}
            onChange={({ target }) => handleChange(target.value, 'cpf')}
            labelWidth={30}
            label="CPF"
            variant="outlined"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            inputProps={{
              placeholder: '000.000.000-00',
              style: { textTransform: 'capitalize', color: '#000' },
            }}
            inputComponent={NumberFormatCPF}
          />
          {cursosUserData
            ? cursosUserData.map((item) => {
                const curso = item;
                const cursoAll = cursosAllData[cursosAllData.findIndex(i=>i.id == item.id)]
                const cursoImage = cursoAll?.image;
                const hasSubCurso = cursoAll?.subs
                const check = Boolean(cursos[`${email.index}--${item.id}`]);


                function onQuantity() {
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
                    return countQuantity - count;
                  } else {
                    Object.keys(cursos).map((k) => {
                      if (
                        k.split('--').length === 2 &&
                        k.includes(item.id) &&
                        cursos[k]
                      )
                        count += 1;
                    });
                    return curso.quantity - count;
                  }
                }

                const quantity = onQuantity();

                return (
                  <>
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
                          onChange={(e) => handleCheck(e, item.id, quantity)}
                          color="primary"
                        />
                      </div>
                    </ItemCurso>

                    {hasSubCurso &&
                      <Collapse unmountOnExit in={check}>
                        {[1,2,3].map(price => {

                          function onItemQuantity() {
                            let count = 0;
                            let countQuantity = 0;

                            Object.keys(cursos).map((k) => {
                              console.log('k',k)
                              if (
                                k.split('--').length === 3 &&
                                k.includes(item.id) &&
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

                          const itemQuantity = onItemQuantity();

                          return (
                            <div key={String(price)}>
                              <EpiView className={'group'}>
                                <p>Grupo {price} (unidades: {itemQuantity})</p>
                              </EpiView>
                              {EPI.filter(i=>i.price == price).sort((a, b) => AscendentObject(a, b, 'name')).map((epi) => {
                                  const checkEPI = Boolean(
                                    cursos[`${email.index}--${item.id}--epi`] &&
                                      cursos[`${email.index}--${item.id}--epi`].findIndex(i=>i.id==epi.id) != -1,
                                  );

                                  return (
                                    <EpiView
                                      key={String(epi.id)}
                                      onClick={() =>
                                        handleEPICheck(
                                          { target: { checked: !checkEPI } },
                                          item.id,
                                          epi,
                                          itemQuantity
                                        )
                                      }
                                    >
                                      <p>{epi.name}</p>
                                      <Check
                                        size="small"
                                        checked={checkEPI}
                                        // onChange={(e) => handleEPICheck(e, item.id, epi, itemQuantity)}
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

                    {/* <ItemCurso>
                    <img src={curso.image} alt={curso.name} />
                    <h1>{curso.name}</h1>
                    <p>{curso.quantity} <span>un.</span></p>
                    <Checkbox
                      style={{gridColumn:'3 / 4',gridRow: '1 / 3',height:35,width:35,alignSelf:'center'}}
                      size='small'
                      cursos={false}
                      color="primary"
                    />
                  </ItemCurso> */}
                  </>
                );
              })
            : null}
        </div>
      ) : (
        <p className="none">
          Nenhum email <br /> selecionado
        </p>
      )}
    </SideEmailContainer>
  );
}
