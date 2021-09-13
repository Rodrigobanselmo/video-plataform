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
import isEqual from 'react-fast-compare';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import { useSellingData } from '../../../context/data/SellingContext';
import { useNotification } from '../../../context/NotificationContext';
import { queryClient } from '../../../services/queryClient';
import { InputSearch } from '../components/InputSearch';
import { filterObject } from '../../../helpers/ObjectArray';
import { fade } from '@material-ui/core/styles';
import {
  formatCPFeCNPJeCEPeCNAE,
  keepOnlyNumbers,
} from '../../../helpers/StringHandle';
import { useAuth } from '../../../context/AuthContext';
import { useSearchClients } from '../../../services/hooks/get/useSearchClients';

const ShowCursosView = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: -2px;

  div {
    display: flex;
    flex-direction: row;
    gap: 6px;
    /* flex-wrap: wrap; */
    /* width: 100%; */
  }
  p {
    font-size: 0.8rem;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.text.third};
    padding: 0px 10px;
    border: 1px solid ${({ theme }) => theme.palette.background.line};
    border-radius: 4px;
  }

  p.curso {
    /* border: 1px solid ${({ theme }) => theme.palette.background.inactive}; */
    /* border: 1px solid ${({ theme }) => theme.palette.status.info}; */
    /* color: ${({ theme }) => theme.palette.status.info}; */
  }

  p.epi {
    /* border: 1px solid ${({ theme }) => theme.palette.status.success}; */
    /* color: ${({ theme }) => theme.palette.status.success}; */
  }
`;

// import {v4} from "uuid";

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  opacity: 0.6;
`;

const InputArea = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
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

const Item = styled.button`
  display: grid;
  border-radius: 5px;
  position: relative;
  border: none;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 100%;
  align-items: center;
  grid-template-columns: 1fr 1fr 0.6fr;
  padding: 0.8rem 1.25rem;
  cursor: pointer;

  p {
    text-align: left;
    font-size: 0.9rem;
    max-width: 100%;
    padding-right: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:after {
    position: absolute;
    content: '';
    bottom: 0px;
    left: 1.25rem;
    width: calc(100% - 2.5rem);
    height: 1px;
    background-color: ${({ theme }) => theme.palette.background.line};
  }

  &:hover {
    background-color: ${({ theme }) => fade(theme.palette.primary.main, 0.1)};
  }
`;

const EditUserDataComponent = ({ formRef, emails, setEmails, isClient }) => {
  //fieldEdit, setFieldEdit, setCursos, setPermissions, setDataUser

  const URL = 'link-url';
  const notification = useNotification();
  const { currentUser } = useAuth();
  const {
    fieldEdit,
    setFieldEdit,
    onCalcUserPrice,
    setCredit,
    setPrices,
    setCursos,
    setPermissions,
    setDataUser,
    dataUser,
    permissions,
    cursos,
  } = useSellingData();
  const mutationSearch = useSearchClients(true);

  function onFocus(name) {
    const value = formRef.current.getFieldValue(name);
    setFieldEdit({ value, index: name });
  }

  function handleChange(e, index) {
    return;
  }

  function handleDeleteMember(index) {
    const newEmails = [...emails];

    newEmails[index] = '';
    formRef.current.setFieldValue(index.toString(), '');

    setDataUser((oldData) => {
      const newData = {};
      Object.keys(oldData).map((key) => {
        // delete newData[key]
        const keySplit = key.split('--');
        const firstSplit = Number(keySplit.splice(0, 1));
        if (firstSplit < index.toString()) newData[key] = oldData[key];
        if (firstSplit > index.toString())
          newData[[Number(firstSplit - 1), ...keySplit].join('--')] =
            oldData[key];
      });
      return newData;
    });

    setCursos((oldCursos) => {
      const newCursos = {};
      Object.keys(oldCursos).map((key) => {
        const keySplit = key.split('--');
        const firstSplit = Number(keySplit.splice(0, 1));
        if (firstSplit < index.toString()) newCursos[key] = oldCursos[key];
        if (firstSplit > index.toString())
          newCursos[[Number(firstSplit - 1), ...keySplit].join('--')] =
            oldCursos[key];
      });
      setPrices(onCalcUserPrice(newCursos));
      return newCursos;
    });

    setPermissions((oldPermissions) => {
      const newPermissions = {};
      Object.keys(oldPermissions).map((key) => {
        const keySplit = key.split('--');
        const firstSplit = Number(keySplit.splice(0, 1));
        if (firstSplit < index.toString())
          newPermissions[key] = oldPermissions[key];
        if (firstSplit > index.toString())
          newPermissions[[Number(firstSplit - 1), ...keySplit].join('--')] =
            oldPermissions[key];
      });
      return newPermissions;
    });

    setCredit((credit) => {
      const newCredit = [...credit];
      newCredit.splice(index, 1);

      return newCredit;
    });

    setFieldEdit({ value: '', index: null });
    setEmails(newEmails.filter((i) => i));
  }

  function handleSelect(value, onClose) {
    const newEmail = [...emails];
    const indexAdded = newEmail.length;
    newEmail[indexAdded] = value.email;

    const newData = { ...dataUser };
    if (value?.uid) newData[`${indexAdded}--uid`] = value.uid;
    if (value?.name) newData[`${indexAdded}--name`] = value.name;
    if (value?.cpf) newData[`${indexAdded}--cpf`] = keepOnlyNumbers(value?.cpf);
    if (value?.cnpj)
      newData[`${indexAdded}--cnpj`] = keepOnlyNumbers(value?.cnpj);
    if (value?.razao) newData[`${indexAdded}--razao`] = value?.razao;

    const newPermissions = { ...permissions };
    value?.permission &&
      value.permission.map((permission) => {
        newPermissions[`${indexAdded}--${permission}`] = true;
      });

    const newCursos = { ...cursos };
    value?.cursos &&
      value.cursos.map((curso) => {
        if (curso?.percentage == 100) return; // TODO: after finished
        const isStarted = curso?.status == 'started'; // TODO: after finished

        newCursos[`${indexAdded}--${curso.id}--${curso.name}`] = isStarted
          ? 'lock'
          : 'open';

        if (curso?.epi) {
          curso.epi.map((epi) => {
            if (!newCursos[`${indexAdded}--${curso.id}--${curso.name}--epi`])
              newCursos[`${indexAdded}--${curso.id}--${curso.name}--epi`] = [];
            newCursos[`${indexAdded}--${curso.id}--${curso.name}--epi`].push({
              ...epi,
              lock: isStarted ? true : false,
            });
          });
        }
      });

    const newPrices = onCalcUserPrice(newCursos);

    setCredit((credit) => {
      const newCredit = [...credit];
      newCredit.push(newPrices[newPrices.length - 1]);

      return newCredit;
    });
    setDataUser(newData);
    setCursos(newCursos);
    setPermissions(newPermissions);
    setPrices(newPrices);
    setEmails(newEmail);
    setFieldEdit({ value: value.email, index: indexAdded.toString() });
    onClose();
  }

  const filter = async (data, search) => {
    // filter with server search
    if (isClient) {
      const newData = await mutationSearch.mutateAsync(search);
      return newData;
    }

    // filter local
    const searchParams = ['name', 'cpf', 'email'];
    const newData = [];
    data.map((row) => {
      if (searchParams[0] && filterObject(row, search, searchParams[0]))
        newData.push({ ...row });
      else if (searchParams[1] && filterObject(row, search, searchParams[1]))
        newData.push({ ...row });
      else if (searchParams[2] && filterObject(row, search, searchParams[2]))
        newData.push({ ...row });
    });
    return newData;
  };

  const users = queryClient.getQueryData(
    isClient ? 'clients' : ['users', currentUser.uid],
  );
  const options = users
    ? users.filter(
        (i) =>
          i?.status && i.status !== 'Pendente' && !emails.includes(i.email),
      )
    : [];

  return (
    <InputsContainer style={{ gap: 20 }}>
      <InputSearch
        filter={filter}
        isTeam={!isClient}
        onSelectItem={handleSelect}
        row={({ item, ...rest }) => (
          <Item {...rest}>
            <p>{item?.razao ?? item?.name}</p>
            <p>{item?.email ?? item?.link}</p>
            <p>
              {item?.cnpj
                ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cnpj))
                : item?.cpf
                ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cpf))
                : '---------------------------'}
            </p>
          </Item>
        )}
        name={'selects'}
        label="Selecione Membros"
        options={options}
      />
      {emails.map((item, index) => {
        return (
          <div key={`${index}`}>
            <InputArea>
              <InputUnform
                width="100%"
                name={`${index}`}
                statusStart={'personalized'}
                value={item}
                // defaultValue={item}
                labelWidth={110}
                label={'e-mail do aluno'}
                onChange={(e) => handleChange(e, index)}
                variant="outlined"
                inputProps={{
                  style: { color: '#000', cursor: 'pointer' },
                }}
                onFocus={() => onFocus(`${index}`)}
                startComponent={() => (
                  <BootstrapTooltip
                    title={`Remover membro.`}
                    styletooltip={{ transform: 'translateY(5px)' }}
                  >
                    <IconButton
                      style={{
                        margin: -5,
                        marginRight: -10,
                        zIndex: 20,
                        width: 20,
                        height: 20,
                      }}
                      onClick={() => handleDeleteMember(index)}
                      aria-label={'delete'}
                    >
                      <IconDelete style={{ fontSize: 17 }} type={'Trash'} />
                    </IconButton>
                  </BootstrapTooltip>
                )}
              />
              {fieldEdit?.index && fieldEdit?.index === `${index}` && (
                <KeyboardArrowRightIcon
                  style={{
                    fontSize: 30,
                    position: 'absolute',
                    right: -25,
                    top: 6,
                  }}
                  type={'Trash'}
                />
              )}
            </InputArea>
            <ShowCursosView>
              {Object.keys(cursos).map((key) => {
                if (!cursos[key]) return null;
                const keys = key.split('--');
                const isEpi = keys.length > 3;
                const fieldIndex = keys[0];
                const cursoName = keys[2];

                if (fieldIndex != index) return null;
                return (
                  <div key={key}>
                    {isEpi ? (
                      cursos[key].map((epi) => (
                        <p key={epi.name} className="epi">
                          {epi.name}
                        </p>
                      ))
                    ) : (
                      <p className="curso">{cursoName}</p>
                    )}
                  </div>
                );
              })}
            </ShowCursosView>
          </div>
        );
      })}
    </InputsContainer>
  );
};

export const EditUserData = React.memo(EditUserDataComponent);
