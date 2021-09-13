/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import * as Yup from 'yup';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { BsInfoCircle } from 'react-icons/bs';
import { InputsContainer } from '../../Dashboard/Components/Standard/PageCarousel';
import { InputUnform } from '../../Main/MuiHelpers/Input';
import {
  FormContainer,
  ButtonForm,
} from '../../Dashboard/Components/Form/comp';
import 'react-phone-number-input/style.css';
import {
  formatCPFeCNPJeCEPeCNAE,
  keepOnlyNumbers,
  wordUpper,
} from '../../../helpers/StringHandle';
import { TestaCPF } from '../../../helpers/StringVerification';
import { isUnique } from '../../../helpers/yupMethods';
import { SIGN } from '../../../routes/routesNames';
import { useMutation } from 'react-query';
import { db } from '../../../lib/firebase.prod';
import { useAuth } from '../../../context/AuthContext';
import IconButton from '@material-ui/core/IconButton';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import { queryClient } from '../../../services/queryClient';
import { v4 } from 'uuid';
import { InputSearch } from '../components/InputSearch';
import { filterObject } from '../../../helpers/ObjectArray';
// import {v4} from "uuid";
import styled, { css } from 'styled-components';
import { fade, darken } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const Item = styled.button`
  display: grid;
  border-radius: 5px;
  position: relative;
  border: none;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 100%;
  align-items: center;
  grid-template-columns: 1.2fr 1fr 1fr;
  padding: 0.8rem 1.25rem;
  cursor: pointer;

  p {
    text-align: left;
    font-size: 0.9rem;
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

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};
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
  padding: 0 10px;
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

function getCreation(docData) {
  if (docData?.createdAt) {
    return new Date(docData.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}

function getType(docData) {
  if (docData?.permissions && docData.permissions.includes('ea')) {
    return 'Administrador';
  }

  if (docData?.permissions && docData.permissions.includes('co')) {
    return 'Instrutor';
  }

  return 'Padrão';
}

function appendData(formData, cursos, permissions, data, user, isAddClient) {
  const array = [];
  const companyId = user.companyId;

  Object.keys(formData).map((key) => {
    //.sort((a, b) => a - b)

    var DATA = {
      companyId: isAddClient ? v4() : companyId,
      status: 'Pendente',
      access: isAddClient ? 'client' : user.access,
      uid: `${Math.random().toString(36).slice(2, 10)}${Math.random()
        .toString(36)
        .slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`,
    };

    DATA.createdAt = new Date().getTime();
    DATA.permission = [];
    DATA.createdByAdmin = !!isAddClient;
    if (!user.access === 'admin' || !isAddClient)
      DATA.createdAtClient = new Date().getTime();

    if (formData[key].includes(SIGN)) {
      DATA.link = formData[key];
      DATA.code = formData[key].split('?code=')[1];
    } else DATA.email = formData[key].toLowerCase().trim();

    Object.keys(permissions).map((keyPermission) => {
      //adicinar permissions
      if (permissions[keyPermission]) {
        const keySplit = keyPermission.split('--');
        const cursoIndex = keySplit[0];
        const permission = keySplit[1];

        if (cursoIndex == key && cursoIndex !== 'quantity') {
          DATA.permission.push(permission);
        }
      }
    });

    if (!isAddClient)
      Object.keys(cursos).map((keyCurso) => {
        //adicinar cursos

        if (cursos[keyCurso]) {
          // se curso estiver selecionado

          const keySplit = keyCurso.split('--');

          const cursoIndex = keySplit[0];
          const cursoId = keySplit[1];
          const isEPI = Boolean(keySplit[2]);

          if (cursoIndex == key && !isEPI) {
            //se nao tem epi
            const dataCursos = DATA['cursos'] ? DATA['cursos'] : [];
            if (dataCursos.findIndex((i) => i.id == cursoId) === -1) {
              DATA['cursos'] = [
                ...dataCursos,
                {
                  id: cursoId,
                  name:
                    user.cursos[user.cursos.findIndex((i) => i.id == cursoId)]
                      .name,
                  quantity: 1,
                },
              ];
            }
          }

          if (cursoIndex == key && isEPI) {
            // se houver epi
            let dataCursos = DATA['cursos'] ? DATA['cursos'] : [];
            const index = dataCursos.findIndex((i) => i.id == cursoId);
            if (index === -1) {
              dataCursos.push({
                id: cursoId,
                quantity: 1,
                epi: [...cursos[keyCurso]],
              });
            } else {
              let epi = dataCursos[index]?.epi ? dataCursos[index].epi : [];
              dataCursos[index] = {
                ...dataCursos[index],
                quantity: 1,
                epi: [...epi, ...cursos[keyCurso]],
              };
            }
            DATA['cursos'] = [...dataCursos];
          }
        }
      });

    if (isAddClient)
      Object.keys(cursos).map((keyCurso) => {
        //adicinar cursos // cursos é o state que tem ['email.index--{}--epi']
        DATA.createdAtAdmin = new Date().getTime();
        if (cursos[keyCurso]) {
          // se curso estiver selecionado

          const keySplit = keyCurso.split('--');
          const cursosAllData = queryClient.getQueryData('cursos');

          const cursoIndex = keySplit[0];
          const cursoId = keySplit[1];

          if (cursoIndex == key) {
            const availableCursos = DATA['availableCursos']
              ? DATA['availableCursos']
              : [];
            const CURSO =
              cursosAllData[cursosAllData.findIndex((i) => i.id == cursoId)];
            if (availableCursos.findIndex((i) => i.id == cursoId) === -1) {
              DATA['availableCursos'] = [
                ...availableCursos,
                { id: cursoId, name: CURSO.name, quantity: cursos[keyCurso] },
              ];
            }

            if (CURSO?.subCursos) {
              let count = 0;
              const CursoAvailableIndex = DATA['availableCursos'].findIndex(
                (i) => i.id == cursoId,
              ); // `email.index--key`
              const CursoAvailableData = []; // `email.index--key`
              Object.keys(permissions).map((keyPermission) => {
                //`quantity--${email.index}--${curso.id}--${price}`
                const keyIsSameIndex = keyPermission.split('--')[1] == key;
                const keyPrice = keyPermission.split('--')[3];
                const keyCursoIdData = keyPermission.split('--')[2];
                if (
                  keyPermission.split('--').length == 4 &&
                  keyIsSameIndex &&
                  keyCursoIdData == cursoId &&
                  permissions[keyPermission] &&
                  permissions[keyPermission] != 0
                ) {
                  CursoAvailableData.push({
                    price: keyPrice,
                    quantity: permissions[keyPermission],
                  });
                  count = Number(count) + Number(permissions[keyPermission]);
                }
              });
              DATA['availableCursos'][CursoAvailableIndex].data = [
                ...CursoAvailableData,
              ];
              DATA['availableCursos'][CursoAvailableIndex].quantity = count;
            }
          }
        }
      });
    const isCNPJ = permissions[`${key}--co`];
    if (isCNPJ) {
      // DATA['company'] = {cpfOrCnpj:'',razao:''};
      if (dataUser[`${key}--company`])
        DATA['company'] = dataUser[`${key}--company`];
      if (dataUser[`${key}--address`])
        DATA['address'] = dataUser[`${key}--address`];
      if (dataUser[`${key}--cnpj`]) DATA['cnpj'] = dataUser[`${key}--cnpj`];
      if (dataUser[`${key}--razao`]) DATA['razao'] = dataUser[`${key}--razao`];
    } else {
      if (dataUser[`${key}--cpf`])
        DATA['cpf'] = formatCPFeCNPJeCEPeCNAE(dataUser[`${key}--cpf`]);
      if (dataUser[`${key}--name`])
        DATA['name'] = wordUpper(dataUser[`${key}--name`].trim().split(' '));
    }

    DATA['type'] = getType(DATA);
    DATA['creation'] = getCreation(DATA);

    if (DATA?.cursos) array.push(DATA);
    if (DATA?.availableCursos) array.push(DATA);
  });
  return array;
}

export const UpdateUserData = React.memo(
  ({
    email,
    isAddClient,
    cursos,
    setCursos,
    setEmail,
    data,
    setData,
    mutation,
    onClose,
    setPermissions,
    permissions,
  }) => {
    const URL = 'link-url';
    const { currentUser } = useAuth();
    const [emails, setEmails] = useState([]);

    const formRef = React.useRef();
    const location = `${window.location.origin}${SIGN}?code=`;

    function isCursoSelected(message) {
      return this.test('isCursoSelected', message, function (value, schema) {
        const { path, createError } = this;
        if (!value) return true;

        let isSelected = false;
        let isEPIMissing = false;
        Object.keys(cursos).map((key) => {
          const keyIsSameIndex = key.split('--')[0] == path; // `email.index--key`

          if (key.split('--').length == 2 && keyIsSameIndex && cursos[key])
            isSelected = true;
          if (
            key.split('--').length == 3 &&
            keyIsSameIndex &&
            Array.isArray(cursos[key]) &&
            cursos[key].length == 0
          )
            isEPIMissing = true;
        });

        if (isAddClient) {
          //se for pagina de addicionar clientes
          Object.keys(permissions).map((key) => {
            //`quantity--${email.index}--${curso.id}--${price}`
            const keyIsSameIndex = key.split('--')[1] == path; // `email.index--key`
            if (
              key.split('--').length == 4 &&
              keyIsSameIndex &&
              permissions[key] &&
              permissions[key] != 0
            )
              isEPIMissing = false;
          });
        }

        if (isEPIMissing) {
          return createError({
            path,
            message: message ?? 'selecione ao menos um tipo de EPI',
          });
        }

        // if (!isSelected) {
        //   return createError({
        //     path,
        //     message: message ?? 'selecione ao menos um curso para este membro',
        //   });
        // }

        return true;
      });
    }

    function isCPFValid(message) {
      return this.test('isCPFValid', message, function (value, schema) {
        const { path, createError } = this;

        if (!value) return true;
        if (!data[`${path}--cpf`]) return true;
        let isCpfValidOrNull = false;

        if (TestaCPF(keepOnlyNumbers(data[`${path}--cpf`])))
          isCpfValidOrNull = true;

        if (!isCpfValidOrNull) {
          return createError({ path, message: message ?? 'CPF inválido' });
        }

        return true;
      });
    }

    Yup.addMethod(Yup.mixed, 'unique', isUnique);
    Yup.addMethod(Yup.mixed, 'curso', isCursoSelected);
    Yup.addMethod(Yup.mixed, 'cpf', isCPFValid);

    const yupObject = {};
    emails.map((i, index) => {
      if (!i.includes(URL))
        yupObject[index] = Yup.string()
          .email('Email com formatação inválida.')
          .trim()
          .unique()
          .curso()
          .cpf();
      if (i.includes(URL)) yupObject[index] = Yup.string().curso().cpf();
    });

    const validation = Yup.object({ ...yupObject });

    const handleSubmit = React.useCallback(
      async (formData) => {
        formRef.current.setErrors({});

        try {
          // throw '';
          await validation.validate(formData, { abortEarly: false });

          if (Object.values(formData).filter((i) => i).length === 0)
            return alert('Preencha os campos');
          const EMAIL_KEY = [];
          await Promise.all(
            Object.keys(formData).map(async (key) => {
              //.sort((a, b) => a - b)
              if (formData[key] && !formData[key].includes(SIGN)) {
                const usersRef = db.collection('users');
                const invitesRef = db.collection('invites');
                const responseUsers = await usersRef
                  .where('email', '==', formData[key])
                  .get();
                const responseInvites = await invitesRef
                  .where('email', '==', formData[key])
                  .get();

                responseUsers.forEach(function (doc) {
                  EMAIL_KEY.push(key);
                });

                responseInvites.forEach(function (doc) {
                  EMAIL_KEY.push(key);
                });
              }
            }),
          );

          if (EMAIL_KEY.length > 0) {
            throw EMAIL_KEY;
          }

          const DATA = appendData(
            formData,
            cursos,
            permissions,
            data,
            currentUser,
            isAddClient,
          );

          const newQuantity = permissions;
          await mutation.mutateAsync({ DATA, newQuantity });
          onClose();

          // console.log('Data',DATA)
          // setData({...data,resume:formData.resume,emails:array})
          // console.log('submitted: formData', formData);
          // console.log('submitted: email');
          // console.log('submitted:cursos ', cursos);
          // console.log('submitted:data ', data);
        } catch (error) {
          if (Array.isArray(error))
            error.map((emailKey) => {
              formRef.current.setFieldError(
                emailKey,
                'Email já cadastrado, para adicionar novos cursos utilize a areá de membros.',
              );
            });
          else {
            console.log('submitted: ', error);
            const errors = {};
            error?.inner?.forEach((err) => {
              errors[err.path] = err.message;
            });
            formRef.current?.setErrors(errors);
          }
        }
      },
      [cursos, data, emails, permissions],
    );

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
      setEmail({ value, index: name });
    }

    function handleChange(e, index) {
      if (emails[index].includes(URL)) return;
      if (!e.target.value) {
        const newCursos = { ...cursos };
        Object.keys(cursos).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newCursos[key];
        });
        const newData = { ...data };
        Object.keys(data).map((key) => {
          if (key.split('--')[0] === index.toString()) delete newData[key];
        });
        const newPermissions = { ...permissions };
        Object.keys(permissions).map((key) => {
          if (key.split('--')[0] === index.toString())
            delete newPermissions[key];
        });
        setData(newData);
        setCursos(newCursos);
        setPermissions(newPermissions);
      }
      setEmail((email) => ({ ...email, value: e.target.value }));
    }

    function handleDeleteMember(index) {
      const newEmails = [...emails];

      newEmails[index] = '';
      formRef.current.setFieldValue(index.toString(), '');

      //deletar name e cpf
      const newCursos = { ...cursos };
      Object.keys(cursos).map((key) => {
        if (key.split('--')[0] === index.toString()) delete newCursos[key];
      });
      const newData = { ...data };
      Object.keys(data).map((key) => {
        if (key.split('--')[0] === index.toString()) delete newData[key];
      });

      const newPermissions = { ...permissions };
      Object.keys(permissions).map((key) => {
        if (key.split('--')[0] === index.toString()) delete newPermissions[key];
      });

      setPermissions(newPermissions);
      setEmail({ value: '', index: null });
      setEmails(newEmails.filter((i) => i));
      setData(newData);
      setCursos(newCursos);
    } //TODO

    function handleURL(index) {
      const newEmails = [...emails];

      if (!emails[index].includes(URL)) {
        const code = `${Math.random()
          .toString(36)
          .slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
        const link = `${URL}-${code}`;
        newEmails[index] = link;

        setEmail({ value: `${location}${code}`, index: index.toString() });
        setEmails(newEmails);
      } else {
        onFocus(`${index}`);
      }
    }

    const filter = (data, search) => {
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

    function handleSelect(value, onClose) {
      const newEmail = [...emails];
      const indexAdded = newEmail.length;
      newEmail[indexAdded] = value.email;

      const newData = {};
      newData[`${indexAdded}--cpf`] = value?.cpf
        ? keepOnlyNumbers(value?.cpf)
        : '';
      newData[`${indexAdded}--name`] = value?.name ? value?.name : '';

      const newPermissions = {};
      value?.permissions &&
        value.permissions.map((permission) => {
          newPermissions[`${indexAdded}--${permission}`] = true;
        });

      const newCursos = {};
      value?.cursos &&
        value.cursos.map((curso) => {
          const isStarted = curso.started == 'started';

          newCursos[`${indexAdded}--${curso.id}`] = isStarted ? 'lock' : 'open';

          if (curso?.epi) {
            curso.epi.map((epi) => {
              if (!newCursos[`${indexAdded}--${curso.id}--epi`])
                newCursos[`${indexAdded}--${curso.id}--epi`] = [];
              newCursos[`${indexAdded}--${curso.id}--epi`].push({
                ...epi,
                lock: isStarted ? true : false,
              });
            });
          }
        });

      setData(newData);
      setCursos(newCursos);
      setPermissions(newPermissions);

      setEmails(newEmail);
      setEmail({ value: value.email, index: indexAdded.toString() });
      onClose();
    }

    const users = queryClient.getQueryData(['users', currentUser.uid]);

    return (
      <InputsContainer>
        <FormContainer noValidate ref={formRef} onSubmit={handleSubmit}>
          <InputSearch
            filter={filter}
            onSelectItem={handleSelect}
            row={({ item, onHandleSelect }) => (
              <Item onClick={() => onHandleSelect(item)}>
                <p>{item.name}</p>
                <p>{item?.email ?? item?.link}</p>
                <p>{item?.cpf ? item.cpf : '---------------------------'}</p>
              </Item>
            )}
            name={'selects'}
            label="Selecione Membros"
            options={
              users
                ? users.filter(
                    (i) => i?.name && i?.email && !emails.includes(i.email),
                  )
                : []
            }
          />
          {emails.map((item, index) => {
            return (
              <InputArea key={`${index}`}>
                <InputUnform
                  width="100%"
                  name={`${index}`}
                  start
                  value={item}
                  defaultValue={item}
                  statusStart={'personalized'}
                  startComponent={() => (
                    <BootstrapTooltip
                      title={`Remover membro.`}
                      styletooltip={{ transform: 'translateY(5px)' }}
                    >
                      <IconButton
                        style={{
                          margin: -5,
                          marginRight: -10,
                          width: 20,
                          zIndex: 20,
                          height: 20,
                        }}
                        onClick={() => handleDeleteMember(index)}
                        aria-label={'delete'}
                      >
                        <IconDelete style={{ fontSize: 17 }} type={'Trash'} />
                      </IconButton>
                    </BootstrapTooltip>
                  )}
                  labelWidth={50}
                  label={'e-mail'}
                  // onChange={(e) => handleChange(e, index)}
                  variant="outlined"
                  inputProps={{
                    style: { color: '#000' },
                  }}
                  // style={!(email?.index&&email?.index===`${index}`)?{}:{ backgroundColor: `#38568a11` }}
                  onFocus={() => onFocus(`${index}`)}
                />
                {email?.index && email?.index === `${index}` && (
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
            );
          })}
          <ButtonForm
            loading={mutation.isLoading}
            type="submit"
            jusify="center"
            primary="true"
            style={{ width: 'fit-content' }}
          >
            Adicionar
          </ButtonForm>
        </FormContainer>
      </InputsContainer>
    );
  },
);
