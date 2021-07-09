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
    { name: 'Luva', id: 1 },
    { name: 'Bota', id: 2 },
    { name: 'Capacete', id: 3 },
    { name: 'Cinto de segunraça', id: 4 },
    { name: 'Luva Quimica', id: 5 },
    { name: 'Luva aprova de fogo', id: 6 },
    { name: 'Luva de plastico', id: 7 },
    { name: 'Óculos protetor', id: 8 },
    { name: 'Óculos UV', id: 9 },
    { name: 'Capacete de chumbo', id: 0 },
    { name: 'Luva', id: 10 },
    { name: 'Bota', id: 20 },
    { name: 'Capacete', id: 30 },
    { name: 'Cinto de segunraça', id: 40 },
    { name: 'Luva Quimica', id: 50 },
    { name: 'Luva aprova de fogo', id: 60 },
    { name: 'Luva de plastico', id: 70 },
    { name: 'Óculos protetor', id: 80 },
    { name: 'Óculos UV', id: 90 },
    { name: 'Capacete de chumbo', id: 11 },
  ];
  const EPI_ID = 'dyuwqf2';
  const { currentUser } = useAuth();

  // console.log(email,cursos)
  const handleChange = (value, name) => {
    const newData = { ...data };
    newData[`${email.index}--${name}`] = value;

    setData(newData);
  };

  const handleCheck = (event, key) => {
    const newData = { ...cursos };
    if (key === EPI_ID) {
      newData[`${email.index}--${key}`] = event.target.checked;
      if (event.target.checked) newData[`${email.index}--${key}--epi`] = [];
      if (!event.target.checked) delete newData[`${email.index}--${key}--epi`];
    } else {
      newData[`${email.index}--${key}`] = event.target.checked;
    }

    console.log('newData', newData);
    setCursos(newData);
  };

  const handleEPICheck = (event, key, epi) => {
    const newData = { ...cursos };
    console.log('event,event', event);

    console.log('epi', epi);
    if (event.target.checked)
      newData[`${email.index}--${key}--epi`] = [
        ...newData[`${email.index}--${key}--epi`],
        epi,
      ];
    if (!event.target.checked)
      newData[`${email.index}--${key}--epi`] = [
        ...newData[`${email.index}--${key}--epi`].filter((i) => i.id !== epi.id),
      ];

    setCursos(newData);
  };

  const cursosData = currentUser?.cursos;
  const isUrl = email.value && email.value.includes(SIGN);

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
          {cursosData
            ? Object.keys(cursosData).map((key) => {
                const curso = cursosData[key];
                const check = Boolean(cursos[`${email.index}--${key}`]);

                function onQuantity() {
                  let count = 0;
                  Object.keys(cursos).map((k) => {
                    if (
                      k.split('--').length === 2 &&
                      k.includes(key) &&
                      cursos[k]
                    )
                      count += 1;
                  });
                  return curso.quantity - count;
                }

                const quantity = onQuantity();

                return (
                  <>
                    <ItemCurso image={curso.image}>
                      <div className="image" alt={curso.name} />
                      <h1>{curso.name}</h1>
                      <p>
                        {quantity} <span>un. restantes</span>
                      </p>
                      <div className="checkbox">
                        <Check
                          size="small"
                          checked={check}
                          onChange={(e) => handleCheck(e, key)}
                          color="primary"
                        />
                      </div>
                    </ItemCurso>
                    <Collapse unmountOnExit in={check}>
                      {EPI.sort((a, b) => AscendentObject(a, b, 'name')).map(
                        (epi) => {
                          const checkEPI = Boolean(
                            cursos[`${email.index}--${key}--epi`] &&
                              cursos[`${email.index}--${key}--epi`].findIndex(i=>i.id==epi.id) != -1,
                          );

                          return (
                            <EpiView
                              onClick={() =>
                                handleEPICheck(
                                  { target: { checked: !checkEPI } },
                                  key,
                                  epi,
                                )
                              }
                            >
                              <p>{epi.name}</p>
                              <Check
                                size="small"
                                checked={checkEPI}
                                onChange={(e) => handleEPICheck(e, key, epi)}
                                color="primary"
                              />
                            </EpiView>
                          );
                        },
                      )}
                    </Collapse>
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
