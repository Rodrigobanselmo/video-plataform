import React, {useState, useMemo} from 'react';
// import AddModal, {Type,Form} from './comp'
import {useNotification} from '../../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../../context/LoaderContext'
import { useAuth } from '../../../../../context/AuthContext'
// import {onCreatePendingUser,onCheckUser} from './func'
import styled from "styled-components";
import { HeaderModal } from '../../../Components/Header';
import { AddUserData } from '../../../../Forms/AddUserData';
import { SideEmail } from '../Side';
import { CheckoutButton } from '../CheckoutButton';
import { db } from '../../../../../lib/firebase.prod';
import { useCreateUsers } from '../../../../../services/hooks/set/useCreateUsers';
import { useSellingData } from '../../../../../context/data/SellingContext';
import { queryClient } from '../../../../../services/queryClient';
import * as Yup from 'yup';
import { isUnique } from '../../../../../helpers/yupMethods';
import { TestaCNPJ, TestaCPF } from '../../../../../helpers/StringVerification';
import { Form } from "@unform/web";
import { formatCPFeCNPJeCEPeCNAE, keepOnlyNumbers, wordUpper } from '../../../../../helpers/StringHandle';
import { v4 } from 'uuid';
import { SIGN } from '../../../../../routes/routesNames';




const Container = styled.div`
    display:flex;
    z-index:1;
    flex-direction:column;
    overflow-x:hidden;
    justify-content:center;
    align-items:center;
    padding:50px 10vw 20px 10vw;
    min-height: 100vh;
    @media screen and (max-width: 800px) {
      padding:50px 0vw 20px 4vw;
    }
`;

const GridContainer = styled(Form)`
  display: grid;
  grid-template-columns: 2.5fr 1.5fr;
  grid-template-rows: 1fr 50px;
  gap: 20px 30px;
  width:100%;
  max-width: 1200px;
  margin: auto 40px;
  align-self: center;
  justify-self: center;
  flex-direction:column;
  max-height:85vh;
  min-height:85vh;

  @media screen and (max-width: 800px) {
    gap: 20px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "email"
      "side"
      "check";
  }
`;

const InputsEmail = styled.div`
  padding:40px 40px 0px 40px;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  border-radius:15px;
  background-color: ${({theme})=>theme.palette.background.paper};
  overflow-y:auto;
  max-height:85vh;
  width:100%;
  grid-row: 1 / 3;
  @media screen and (max-width: 800px) {
    grid-area:email;
  }
`;

function getCreation(docData) {
  if (docData?.createdAt) {
    return new Date(docData.createdAt).toLocaleDateString('pt-BR', {
      day:'2-digit',
      month:'long',
      year:'numeric',
    })
  }
}

function getType(docData) {
  if (docData?.permissions && docData.permissions.includes('ea')) {
    return 'Administrador'
  }

  if (docData?.permissions && docData.permissions.includes('co')) {
    return 'Instrutor'
  }

  return 'Padrão'
}

function appendData(formData, prices, cursos, permissions, dataUser, user, isNewClient, isAdmin, isBilling) {
  const array = []
  const companyId = user.companyId

  Object.keys(formData).map((key) => { //.sort((a, b) => a - b)

    var DATA = {
      companyId:isAdmin
        ? (isNewClient ? v4(): companyId)
        :companyId,
      status: 'Pendente',
      access: isNewClient?'client':user.access,
      uid: v4()
    }

    DATA.createdAt = new Date().getTime();
    DATA.permission = [];
    DATA.billId = DATA.uid;
    DATA.createdByAdmin = isAdmin;
    DATA.isPrimaryAccount = !!(isAdmin && isNewClient);
    DATA.cursos = []
    DATA['statement'] = []

    if (formData[key] && formData[key].includes(SIGN)) {
      DATA.link = formData[key]
      DATA.code = formData[key].split('?code=')[1]
    } else DATA.email = formData[key].toLowerCase().trim()

    Object.keys(permissions).map((keyPermission)=>{ //adicinar permissions
      if (permissions[keyPermission]) {
        const keySplit = keyPermission.split('--')
        const cursoIndex = keySplit[0]
        const permission = keySplit[1]

        if (cursoIndex == key && cursoIndex !== 'quantity' )  {
          DATA.permission.push(permission)
        }
      }
    })

    //adicinar cursos qunadon
    // if (!isNewClient)
    Object.keys(cursos).map((keyCurso)=>{

      if (cursos[keyCurso]) { // se curso estiver selecionado

        const keySplit = keyCurso.split('--')

        const cursoIndex = keySplit[0]
        const cursoId = keySplit[1]
        const isEPI = Boolean(keySplit[3])

        const allCursos = queryClient.getQueryData('cursos')

        if (cursoIndex == key && !isEPI)  { //se nao tem epi
          const dataCursos = DATA['cursos'] ? DATA['cursos'] : []
          if (dataCursos.findIndex(i=>i.id == cursoId) === -1) {
            DATA['cursos'] = [...dataCursos,{id:cursoId,name:allCursos[allCursos.findIndex(i=>i.id==cursoId)].name,quantity:1}]
          }
        }

        if (cursoIndex == key && isEPI)  { // se houver epi
          let dataCursos = DATA['cursos'] ? DATA['cursos'] : []
          const index = dataCursos.findIndex(i=>i.id == cursoId)
          if (index === -1) {
            dataCursos.push({id:cursoId,quantity:1,epi:[...cursos[keyCurso]]})
          } else {
            let epi = dataCursos[index]?.epi ? dataCursos[index].epi : []
            dataCursos[index] = {...dataCursos[index],quantity:1 , epi: [...epi,...cursos[keyCurso]]}
          }
          DATA['cursos'] = [...dataCursos]
        }

      }

    })

    // //adicinar cursos quando for para empresas e eu for admin // cursos é o state que tem ['email.index--{}--epi']
    // if (isAdmin) Object.keys(cursos).map((keyCurso)=>{
    //   DATA.createdAtAdmin = new Date().getTime();
    //   if (cursos[keyCurso]) { // se curso estiver selecionado

    //     const keySplit = keyCurso.split('--')
    //     const cursosAllData = queryClient.getQueryData('cursos');

    //     const cursoIndex = keySplit[0]
    //     const cursoId = keySplit[1]

    //     if (cursoIndex == key)  {
    //       const availableCursos = DATA['availableCursos'] ? DATA['availableCursos'] : []
    //       const CURSO = cursosAllData[cursosAllData.findIndex(i=>i.id==cursoId)]
    //       if (availableCursos.findIndex(i=>i.id == cursoId) === -1) {
    //         DATA['availableCursos'] = [...availableCursos,{id:cursoId,name:CURSO.name,quantity:cursos[keyCurso]}]
    //       }

    //       if (CURSO?.subCursos) {
    //         let count = 0;
    //         const CursoAvailableIndex = DATA['availableCursos'].findIndex(i=>i.id == cursoId); // `email.index--key`
    //         const CursoAvailableData = []; // `email.index--key`
    //         Object.keys(permissions).map((keyPermission) => { //`quantity--${email.index}--${curso.id}--${price}`
    //           const keyIsSameIndex = keyPermission.split('--')[1] == key;
    //           const keyPrice = keyPermission.split('--')[3];
    //           const keyCursoIdData = keyPermission.split('--')[2];
    //           if (
    //             keyPermission.split('--').length == 4 &&
    //             keyIsSameIndex &&
    //             keyCursoIdData == cursoId &&
    //             permissions[keyPermission] &&
    //             permissions[keyPermission] != 0
    //           ) {
    //             CursoAvailableData.push({price:keyPrice,quantity:permissions[keyPermission]})
    //             count = Number(count) + Number(permissions[keyPermission])
    //           }
    //         })
    //       DATA['availableCursos'][CursoAvailableIndex].data = [...CursoAvailableData]
    //       DATA['availableCursos'][CursoAvailableIndex].quantity = count

    //       }
    //     }

    //   }

    // })
    const isCNPJ =  permissions[(`${key}--co`)]
    if (isCNPJ) {
      DATA['company'] = {cpfOrCnpj:'',razao:''};
      if (dataUser[`${key}--company`]) DATA['company'] = dataUser[`${key}--company`]
      if (dataUser[`${key}--address`]) DATA['address'] = dataUser[`${key}--address`]
      if (dataUser[`${key}--razao`]) DATA['company'] = {...DATA['company'], razao: dataUser[`${key}--razao`]};
      if (dataUser[`${key}--cnpj`]) DATA['company'] ={...DATA['company'], cpfOrCnpj: dataUser[`${key}--cnpj`]};
    } else {
      if (dataUser[`${key}--cpf`]) DATA['cpf'] = formatCPFeCNPJeCEPeCNAE(dataUser[`${key}--cpf`])
      if (dataUser[`${key}--name`]) DATA['name'] = wordUpper((dataUser[`${key}--name`].trim()).split(" "))
    }


    // const value = isBilling ? prices[key] : 0
    if (prices[key]) DATA['statement'] = [{value:prices[key], type:'debit',created_at:(new Date()).getTime(),desc:'Compra de curso',buyerId:user.uid}]

    DATA['type'] = getType(DATA)
    DATA['creation'] = getCreation(DATA)

    // if (DATA?.cursos)
    // if (DATA?.availableCursos) array.push(DATA)
    if (DATA?.email || DATA?.link) array.push(DATA)
    console.log('DATA',DATA)

  });
  return array

}

export function FirstPageAddModal({setPosition,onEnd, isNewClient:isNew}) {

  const {currentUser} = useAuth();
  const mutation = useCreateUsers()

  const formRef = React.useRef();
  const URL = 'link-url';
  const isAdmin = currentUser.access === 'admin';
  const isNewClient = isNew;

  // const {setLoad} = useLoaderScreen();
  const notification = useNotification();

  const [load, setLoad] = useState(false);
  const [emails, setEmails] = useState(['', '']);
  const { isBilling, totalPrice, setCheckoutInfo, dataUser, setDataUser, cursos, setCursos, permissions, setPermissions, prices, setPrices, fieldEdit, setFieldEdit } = useSellingData()

  function isCursoSelected(message) {
    return this.test('isCursoSelected', message, function (value, schema) {
      const { path, createError } = this;
      if (!value) return true;
      if (isAdmin) return true;

      let isSelected = false;
      let isEPIMissing = false;

      Object.keys(cursos).map((key) => {
        console.log('key', key, cursos[key]);

        const keyIsSameIndex = key.split('--')[0] == path; // `email.index--key`

        if (key.split('--').length == 3 && keyIsSameIndex && cursos[key])
          isSelected = true;
        if (
          key.split('--').length == 4 &&
          keyIsSameIndex &&
          Array.isArray(cursos[key]) &&
          cursos[key].length == 0
        )
          isEPIMissing = true;
      });

      // if (isNewClient) { //se for pagina de addicionar clientes
      //   Object.keys(permissions).map((key) => { //`quantity--${email.index}--${curso.id}--${price}`
      //     const keyIsSameIndex = key.split('--')[1] == path; // `email.index--key`
      //     console.log('permissions[key]',permissions)
      //     if (
      //       key.split('--').length == 4 &&
      //       keyIsSameIndex &&
      //       permissions[key] &&
      //       permissions[key] != 0
      //     )
      //       isEPIMissing = false;
      //   })
      // }

      if (isEPIMissing) {
        return createError({
          path,
          message: message ?? 'selecione ao menos um tipo de EPI',
        });
      }

      if (!isSelected) {
        return createError({
          path,
          message: message ?? 'selecione ao menos um curso para este membro',
        });
      }

      return true;
    });
  }

  function isCPFValid(message) {
    return this.test('isCPFValid', message, function (value, schema) {
      const { path, createError } = this;
      const isCNPJ =  permissions[(`${path}--co`)]

      if (isCNPJ) return true;
      if (!value) return true;
      if (!dataUser[`${path}--cpf`]) return true;
      let isCpfValidOrNull = false;

      // console.log('dataUser[`${path}--cpf`]', dataUser[`${path}--cpf`]);
      if (TestaCPF(keepOnlyNumbers(dataUser[`${path}--cpf`])))
        isCpfValidOrNull = true;

      if (!isCpfValidOrNull) {
        return createError({ path, message: message ?? 'CPF inválido' });
      }

      return true;
    });
  }

  function isCNPJValid(message) {
    return this.test('isCPFValid', message, function (value, schema) {
      const { path, createError } = this;
      const isCNPJ =  permissions[(`${path}--co`)]

      if (!isCNPJ) return true;
      if (!value) return true;
      if (!dataUser[`${path}--cnpj`]) return true;
      let isCnpjValidOrNull = false;

      // console.log('dataUser[`${path}--cpf`]', dataUser[`${path}--cpf`]);
      if (TestaCNPJ(keepOnlyNumbers(dataUser[`${path}--cnpj`])))
        isCnpjValidOrNull = true;

      if (!isCnpjValidOrNull) {
        return createError({ path, message: message ?? 'CNPJ inválido' });
      }

      return true;
    });
  }

  Yup.addMethod(Yup.mixed, 'unique', isUnique);
  Yup.addMethod(Yup.mixed, 'curso', isCursoSelected);
  Yup.addMethod(Yup.mixed, 'cpf', isCPFValid);
  Yup.addMethod(Yup.mixed, 'cnpj', isCNPJValid);

  const yupObject = {};
  emails.map((i, index) => {
    if (!i.includes(URL))
      yupObject[index] = Yup.string()
        .email('Email com formatação inválida.').trim()
        .unique()
        .curso()
        .cnpj()
        .cpf();
    if (i.includes(URL)) yupObject[index] = Yup.string().curso().cnpj().cpf();
  });

  const validation = Yup.object({ ...yupObject });

  // !remove
  function later(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  const handleSubmit = React.useCallback(
    async (formData) => {
      formRef.current.setErrors({});
      console.log('setLoad to true')
      setLoad(true)

      try {
        await validation.validate(formData, { abortEarly: false });
        await later(500)
        console.log('formData',formData)
        if (Object.values(formData).filter(i=>i.trim()).length === 0) {
          console.log('setLoad to false')
          setLoad(false)
          return alert('Preencha os campos')
        }
        const EMAIL_KEY = [];
        await Promise.all(Object.keys(formData).map(async (key) => { //.sort((a, b) => a - b)
          if ('0' in formData && formData[key] && !formData[key].includes(SIGN)) {
            const usersRef = db.collection('users');
            const invitesRef = db.collection('invites');
            const responseUsers = await usersRef.where('email', '==', formData[key]).get()
            const responseInvites = await invitesRef.where('email', '==', formData[key]).get()

            responseUsers.forEach(function (doc) {
              EMAIL_KEY.push(key)
            })

            responseInvites.forEach(function (doc) {
              EMAIL_KEY.push(key)
            })

          }
        }));

        if (EMAIL_KEY.length > 0) {
          throw EMAIL_KEY
        }

      const DATA = appendData(formData, prices,cursos,permissions,dataUser,currentUser,isNewClient,isAdmin, isBilling)
      console.log(1234)
        // const totalPrice = prices.reduce((acc,price)=>Number(acc)+Number(price),[0])

        if (isAdmin && !isNewClient) {
          await mutation.mutateAsync({data:DATA,user:currentUser,noStatement:true})
          onEnd()
        } else {
      console.log(12346)
          setPosition(2)
          setLoad(false)
          setCheckoutInfo({data:DATA, total:totalPrice})

        }
        // console.log('Data',{data:DATA,total:totalPrice})
        // throw ''

        // const newQuantity = permissions
        // await mutation.mutateAsync({DATA,newQuantity})
        // setLoad(false)
        // onClose()
        // console.log('Data',DATA)
        // setDataUser({...dataUser,resume:formData.resume,emails:array})
        // console.log('submitted: formData', formData);
        // console.log('submitted: email');
        // console.log('submitted:cursos ', cursos);
        // console.log('submitted:dataUser ', dataUser);
      } catch (error) {

        console.log('submitted: ',error);
        console.log('setLoad to false')
        setLoad(false)
        if (Array.isArray(error)) error.map(emailKey=>{
          console.log('submitted: ',error);
          formRef.current.setFieldError(emailKey, 'Email já cadastrado, para adicionar novos cursos utilize a areá de membros.');
          notification.error({message:'Email já cadastrado, para adicionar novos cursos utilize a areá de membros.',modal:true})
        })
        else {
          if (error?.inner && error.inner[0]) notification.error({message:error.inner[0].message,modal:true})
          console.log('submitted: ',error);
          const errors = {};
          error?.inner?.forEach((err) => {
            errors[err.path] = err.message;
          });
          formRef.current?.setErrors(errors);
        }
      }
    },
    [cursos, dataUser, emails, permissions, prices],
  );

  return (
    <Container>
      <GridContainer
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
      >

        <InputsEmail>
          <HeaderModal
            center
            text={!isAdmin
              ? 'Adicionar Novos Alunos a Plataforma'
              : 'Adicionar Novos Clientes a Plataforma'
            }
            subText='Para inserir novos alunos a plataforma, basta informar email de catastro e/ou gerar link compartilhavel e escolher os cursos que deseja comprar.'
            />
          {/* { !update ? ( */}
            <AddUserData
              emails={emails}
              setEmails={setEmails}
              formRef={formRef}
              fieldEdit={fieldEdit}
              setFieldEdit={setFieldEdit}
              setCursos={setCursos}
              setPermissions={setPermissions}
              setDataUser={setDataUser}
            />
          {/* ) : (
            <UpdateUserData
              cursos={cursosSelected}
              permissions={permissions}
              setPermissions={setPermissions}
              setCursos={setCursosSelected}
              setEmail={setEmail}
              setData={setDataUser}
              data={dataUser}
              mutation={mutation}
              onClose={onClose}
              isAdmin={isAdmin}
              email={email}
          />
          )} */}
        </InputsEmail>

        <SideEmail
          isNewClient={isNewClient}
          isAdmin={false}
        />
        <CheckoutButton
          totalPrice={totalPrice}
          load={load}
        />
      </GridContainer>
    </Container>
  );
}
