/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { BsInfoCircle } from 'react-icons/bs';
import styled, { css } from 'styled-components';
import { InputsContainer } from '../../Dashboard/Components/Standard/PageCarousel';
import { InputUnform } from '../../Main/MuiHelpers/Input';
import 'react-phone-number-input/style.css';
import { SIGN } from '../../../routes/routesNames';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import isEqual from "react-fast-compare";
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import { useSellingData } from '../../../context/data/SellingContext';

const ShowCursosView = styled.div`
  display:flex;
  flex-direction:row;
  gap:6px;
  flex-wrap: wrap;
  width: 100%;
  margin-top:-2px;

  > p {
    font-size:0.80rem;
    font-weight:bold;
    color: ${({ theme }) => theme.palette.text.third};
    padding:0px 10px;
    border: 1px solid ${({theme})=> theme.palette.background.line };
    border-radius: 4px;
  }

  > p.curso {
    /* border: 1px solid ${({theme})=> theme.palette.background.inactive }; */
    /* border: 1px solid ${({theme})=> theme.palette.status.info }; */
    /* color: ${({ theme }) => theme.palette.status.info}; */
  }

  > p.epi {
    /* border: 1px solid ${({theme})=> theme.palette.status.success }; */
    /* color: ${({ theme }) => theme.palette.status.success}; */
  }
`;

// import {v4} from "uuid";


const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.primary.main};
  opacity:0.6;
`;

const LinkButton = styled.button`
  border: 1px solid ${({ theme }) => theme.palette.background.line};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-weight: bold;
  background-color: #eee;
  display: flex;
  flex: 1;
  align-items: center;
  height: 42px;
  padding:0 10px;
  font-size: 13px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  transform: translateX(13.5px);
  /* margin-right: -3px; */
  flex-direction: column;
  justify-content: center;
  text-align: center;
  /* padding: 0 7px; */
  cursor: pointer;

  &:hover {
    filter: brightness(90%);
  }

  ${(props) =>
    props.activeURL &&
    css`
      color: ${({ theme }) => theme.palette.primary.contrastText};
      background-image: linear-gradient(
        -10deg,
        ${({ theme }) => theme.palette.primary.main},
        ${({ theme }) => theme.palette.primary.light}
      );
    `}

  @media screen and (max-width: 1100px) {
    height: 41px;
  }
  @media screen and (max-width: 700px) {
    height: 39px;
    font-size: 12px;
  }
`;

const InputArea = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
position:relative;
`;

export const IconEnd = styled(BsInfoCircle)`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  /* ${(props) =>
    props.status === 'Normal' &&
    css`
      color: ${({ theme }) => theme.palette.text.primary};
    `} */
`;

export const Delete = styled(DeleteOutlineIcon)`
  color: ${({ theme }) => theme.palette.status.failD};
`;

export const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  /*     max-width:550px; */
  width: 100%;
  margin-bottom: 20px;
`;

export const AddAnother = styled.div`
  max-width: fit-content;
  padding: 7px 10px;
  border-radius: 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
  border-color: ${({ theme }) => theme.palette.background.inactive};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;



const AddUserDataComp = ({ formRef, emails, setEmails,  }) => { //fieldEdit, setFieldEdit, setCursos, setPermissions, setDataUser

  const URL = 'link-url';
  const location = `${window.location.origin}${SIGN}?code=`;
  const { fieldEdit, setFieldEdit, setCursos, setPermissions, setDataUser, cursos } = useSellingData()

  function handleAddEmail() {
    const array = [];
    const allData = formRef.current.getData();
    Object.keys(allData)
      .sort((a, b) => a - b)
      .map((key) => {
        if (allData[key].includes(SIGN)) array.push(emails[key]);
        if (!allData[key].includes(SIGN)) array.push(allData[key]);
      });
    setEmails([...array, '']);
  }

  function onFocus(name) {
    const value = formRef.current.getFieldValue(name);
    setFieldEdit({ value, index: name });
  }

  function handleChange(e, index) {
    if (emails[index].includes(URL)) return;
    if (!e.target.value) {
      setDataUser(oldData => {
        const newData = { ...oldData };
        Object.keys(oldData).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newData[key];
        });
        return newData
      });

      setCursos(oldCursos => {
        const newCursos = { ...oldCursos };
        Object.keys(oldCursos).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newCursos[key];
        });
        return newCursos
      });

      setPermissions(oldPermissions => {
        const newPermissions = { ...oldPermissions };
        Object.keys(oldPermissions).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newPermissions[key];
        });
        return newPermissions
      });
    }
    setFieldEdit((email) => ({ ...email, value: e.target.value }));
  }

  function handleDeleteURL(index) {
    const newEmails = [...emails];

    if (emails[index].includes(URL)) {
      newEmails[index] = '';
      formRef.current.setFieldValue(index.toString(), '');

      //deletar name e cpf

      setDataUser(oldData => {
        const newData = { ...oldData };
        Object.keys(oldData).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newData[key];
        });
        return newData
      });

      setCursos(oldCursos => {
        const newCursos = { ...oldCursos };
        Object.keys(oldCursos).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newCursos[key];
        });
        return newCursos
      });

      setPermissions(oldPermissions => {
        const newPermissions = { ...oldPermissions };
        Object.keys(oldPermissions).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newPermissions[key];
        });
        return newPermissions
      });

      setFieldEdit({ value:'', index:null });
      setEmails(newEmails);
    }

  }

  function handleURL(index) {
    const newEmails = [...emails];

    if (!emails[index].includes(URL)) {
      const code = `${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
      const link = `${URL}-${code}`;
      newEmails[index] = link

      setFieldEdit({ value:`${location}${code}`, index:index.toString() });
      setEmails(newEmails);
    } else {
      onFocus(`${index}`)
    }
  }

  return (
    <InputsContainer style={{gap:20}}>
        {emails.map((item, index) => {
          const isURL = item.includes(URL);

          return (
            <div key={`${index}`}>
              <InputArea >
                <InputUnform
                  width="100%"
                  name={`${index}`}
                  statusStart={isURL?'personalized':false}
                  labelWidth={isURL ? 0 : 110}
                  label={isURL ? '' : 'e-mail do aluno'}
                  onChange={(e) => handleChange(e, index)}
                  variant="outlined"
                  inputProps={{
                    style: { color: isURL ? '#00000075' : '#000' },
                  }}
                  onFocus={() => onFocus(`${index}`)}
                  startComponent={()=>
                    <BootstrapTooltip title={`Deletar link conpartilhavel.`} styletooltip={{transform: 'translateY(5px)'}}>
                      <IconButton style={{margin:-5,marginRight:-10,zIndex:20,width:20,height:20}} onClick={() => handleDeleteURL(index)}  aria-label={'delete'}>
                        <IconDelete style={{fontSize:17}} type={'Trash'} />
                      </IconButton>
                    </BootstrapTooltip>
                  }
                  endComponent={()=>
                    <BootstrapTooltip title={`Você também pode gerar um link para encaminhar ao aluno que deseja disponibilizar os cursos.`} styletooltip={{transform: 'translateY(5px)'}}>
                      <LinkButton
                        activeURL={isURL}
                        type="button"
                        onClick={() => handleURL(index)}
                      >
                      gerar link <br/>compartilhavel
                    </LinkButton>
                  </BootstrapTooltip>
                  }
                  {...(isURL
                    ? { value: `${location}${item.split('-')[2]}` }
                    : {})
                  }
                />
                {(fieldEdit?.index&&fieldEdit?.index===`${index}`) && <KeyboardArrowRightIcon style={{fontSize:30,position:'absolute',right:-25,top:6}} type={'Trash'} />}
              </InputArea>
              <ShowCursosView>
                {Object.keys(cursos).map((key)=>{
                  if (!cursos[key]) return null
                  const keys = key.split('--')
                  const isEpi = keys.length > 3
                  const fieldIndex = keys[0]
                  const cursoName = keys[2]

                  if (fieldIndex != index) return null
                  return (
                    <>
                      {isEpi ? (
                        cursos[key].map(epi=><p className='epi'>{epi.name}</p>)
                      ) : (
                        <p className='curso'>{cursoName}</p>
                      )}
                    </>
                  )
                })}
              </ShowCursosView>
            </div>
          );
        })}
        <AddAnother onClick={handleAddEmail}>
          <p>Adicionar Outro</p>
        </AddAnother>
        {/* <ButtonForm
          loading={mutation.isLoading}
          type="submit"
          jusify="center"
          primary="true"
          style={{ width: 'fit-content' }}
        >
          Adicionar
        </ButtonForm> */}
    </InputsContainer>
  );
};

export const AddUserData = React.memo(AddUserDataComp);
