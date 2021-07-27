import React, {useState, useEffect,useMemo} from 'react';
// import AddModal, {Type,Form} from './comp'
import {userTypes,headCells,rows} from '../../../../constants/userTypes'
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useAuth } from '../../../../context/AuthContext'
import Carrousel, {PagesDiv} from '../../../Main/Carrousel/CarrouselFirst'
import {onCreatePendingUser,onCheckUser} from './func'
import { useSelector,useDispatch } from 'react-redux'
import { ModalFullScreen } from '../../ModalFullScreen';
import styled from "styled-components";
import { HeaderModal } from '../../Components/Header';
import { AddUserData } from '../../../Forms/AddUserData';
import { SideEmail } from './Side';
import { CheckoutButton } from './CheckoutButton';
import { useQuery } from 'react-query';
import { db } from '../../../../lib/firebase.prod';
import { useCreateUsers } from '../../../../services/hooks/set/useCreateUsers';
import { UpdateUserData } from '../../../Forms/UpdateUserData';
import { SellingContext } from '../../../../context/data/SellingContext';
import { queryClient } from '../../../../services/queryClient';
import * as Yup from 'yup';
import { isUnique } from '../../../../helpers/yupMethods';
import { TestaCPF } from '../../../../helpers/StringVerification';
import { Form } from "@unform/web";
import { formatCPFeCNPJeCEPeCNAE, keepOnlyNumbers, wordUpper } from '../../../../helpers/StringHandle';
import { v4 } from 'uuid';




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

function appendData(formData,cursos,permissions,dataUser,user,isAddClient) {
  const array = []
  const companyId = user.companyId

  Object.keys(formData).map((key) => { //.sort((a, b) => a - b)

    var DATA = {
      companyId:isAddClient?v4():companyId,
      status: 'Pendente',
      access: isAddClient?'client':user.access,
      uid:`${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`
    }

    DATA.createdAt = new Date().getTime();
    DATA.permission = [];
    DATA.createdByAdmin = !!isAddClient;
    if (!user.access === 'admin' || !isAddClient) DATA.createdAtClient = new Date().getTime();

    if (formData[key].includes(SIGN)) {
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

    if (!isAddClient) Object.keys(cursos).map((keyCurso)=>{ //adicinar cursos

      if (cursos[keyCurso]) { // se curso estiver selecionado

        const keySplit = keyCurso.split('--')

        const cursoIndex = keySplit[0]
        const cursoId = keySplit[1]
        const isEPI = Boolean(keySplit[2])


        if (cursoIndex == key && !isEPI)  { //se nao tem epi
          const dataCursos = DATA['cursos'] ? DATA['cursos'] : []
          if (dataCursos.findIndex(i=>i.id == cursoId) === -1) {
            DATA['cursos'] = [...dataCursos,{id:cursoId,name:user.cursos[user.cursos.findIndex(i=>i.id==cursoId)].name,quantity:1}]
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

    if (isAddClient) Object.keys(cursos).map((keyCurso)=>{ //adicinar cursos // cursos é o state que tem ['email.index--{}--epi']
      DATA.createdAtAdmin = new Date().getTime();
      if (cursos[keyCurso]) { // se curso estiver selecionado

        const keySplit = keyCurso.split('--')
        const cursosAllData = queryClient.getQueryData('cursos');

        const cursoIndex = keySplit[0]
        const cursoId = keySplit[1]

        if (cursoIndex == key)  {
          const availableCursos = DATA['availableCursos'] ? DATA['availableCursos'] : []
          const CURSO = cursosAllData[cursosAllData.findIndex(i=>i.id==cursoId)]
          if (availableCursos.findIndex(i=>i.id == cursoId) === -1) {
            DATA['availableCursos'] = [...availableCursos,{id:cursoId,name:CURSO.name,quantity:cursos[keyCurso]}]
          }

          if (CURSO?.subCursos) {
            let count = 0;
            const CursoAvailableIndex = DATA['availableCursos'].findIndex(i=>i.id == cursoId); // `email.index--key`
            const CursoAvailableData = []; // `email.index--key`
            Object.keys(permissions).map((keyPermission) => { //`quantity--${email.index}--${curso.id}--${price}`
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
                CursoAvailableData.push({price:keyPrice,quantity:permissions[keyPermission]})
                count = Number(count) + Number(permissions[keyPermission])
              }
            })
          DATA['availableCursos'][CursoAvailableIndex].data = [...CursoAvailableData]
          DATA['availableCursos'][CursoAvailableIndex].quantity = count

          }
        }

      }

    })

    if (dataUser[`${key}--cpf`]) DATA['cpf'] = formatCPFeCNPJeCEPeCNAE(dataUser[`${key}--cpf`])
    if (dataUser[`${key}--name`]) DATA['name'] = wordUpper((dataUser[`${key}--name`].trim()).split(" "))

    DATA['type'] = getType(DATA)
    DATA['creation'] = getCreation(DATA)

    if (DATA?.cursos) array.push(DATA)
    if (DATA?.availableCursos) array.push(DATA)
    console.log('DATA',DATA)

  });
  return array

}

export function AddMemberModal({open,setOpen,isAddClient,update}) {

  const {currentUser} = useAuth();
  const mutation = useCreateUsers()

  const formRef = React.useRef();

  // const [email, setEmail] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
  // const [unform, setUnform] = useState({}) //dados dos email inseridos nos inputs
  const [infoModal, setInfoModal] = useState({title:'',text:''}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
  const [position, setPosition] = useState(1) //posicao do carrousel
  const [emails, setEmails] = useState(['', '']);


  const {setLoad} = useLoaderScreen();
  const notification = useNotification();
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)

  const cursosAllData = queryClient.getQueryData('cursos');


  const [fieldEdit, setFieldEdit] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
  const [dataUser, setDataUser] = useState({})
  const [cursos, setCursos] = useState({});
  const [subCursos, setSubCursos] = useState({});
  const [permissions, setPermissions] = useState({});
  const [prices, setPrices] = useState([]);

  // const [dataUser, setDataUser] = useState({}) //dados dos email inseridos nos inputs
  // const [cursosSelected, setCursosSelected] = useState({});
  // const [permissions, setPermissions] = useState({});

  function onClose() {
      if (mutation.isLoading) return

      setFieldEdit({value:null,index:null})
      setDataUser({})
      setCursos({})
      setSubCursos({})
      setPermissions({})
      setPrices([])
      setOpen(false)
  }

  function onGoBack() {
  //   if (position == 2) setInfoModal({title:'',text:''})
  //   else if (position == 3 && save) return notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim, os dados inseridos serão perdidos?',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
  //     setPosition(position=>position-1)
  //     dispatch({ type: 'SAVE', payload: false })
  //   }})
  //   setPosition(position=>position-1)
  }

  function isCursoSelected(message) {
    return this.test('isCursoSelected', message, function (value, schema) {
      const { path, createError } = this;
      if (!value) return true;

      let isSelected = false;
      let isEPIMissing = false;

      Object.keys(cursos).map((key) => {
        console.log('key', key, cursos[key]);

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

      if (isAddClient) { //se for pagina de addicionar clientes
        Object.keys(permissions).map((key) => { //`quantity--${email.index}--${curso.id}--${price}`
          const keyIsSameIndex = key.split('--')[1] == path; // `email.index--key`
          console.log('permissions[key]',permissions)
          if (
            key.split('--').length == 4 &&
            keyIsSameIndex &&
            permissions[key] &&
            permissions[key] != 0
          )
            isEPIMissing = false;
        })
      }

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

  Yup.addMethod(Yup.mixed, 'unique', isUnique);
  Yup.addMethod(Yup.mixed, 'curso', isCursoSelected);
  Yup.addMethod(Yup.mixed, 'cpf', isCPFValid);

  const yupObject = {};
  emails.map((i, index) => {
    if (!i.includes(URL))
      yupObject[index] = Yup.string()
        .email('Email com formatação inválida.').trim()
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
        await validation.validate(formData, { abortEarly: false });
        if (Object.values(formData).filter(i=>i).length === 0) return alert('Preencha os campos')
        const EMAIL_KEY = [];
        await Promise.all(Object.keys(formData).map(async (key) => { //.sort((a, b) => a - b)
          if (formData[key] && !formData[key].includes(SIGN)) {
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

        const DATA = appendData(formData,cursos,permissions,dataUser,currentUser,isAddClient)

        const newQuantity = permissions
        await mutation.mutateAsync({DATA,newQuantity})
        onClose()

        // console.log('Data',DATA)
        // setDataUser({...dataUser,resume:formData.resume,emails:array})
        // console.log('submitted: formData', formData);
        // console.log('submitted: email');
        // console.log('submitted:cursos ', cursos);
        // console.log('submitted:dataUser ', dataUser);
      } catch (error) {

        if (Array.isArray(error)) error.map(emailKey=>{
          formRef.current.setFieldError(emailKey, 'Email já cadastrado, para adicionar novos cursos utilize a areá de membros.');
        })
        else {
          console.log('submitted: ',error);
          const errors = {};
          error?.inner?.forEach((err) => {
            errors[err.path] = err.message;
          });
          formRef.current?.setErrors(errors);
        }
      }
    },
    [cursos, dataUser, emails,permissions],
  );

  function onCalcUserPrice(cursos) {

    const cursosArray = [];
    Object.keys(cursos).map((key)=>{
      if (!cursos[key]) return null

      const fieldIndex = key.split('--')[0]
      const cursoId = key.split('--')[1]

      if (Array.isArray(cursos[key])) {
        //curso de epi de segunda order
        if (!cursosArray[fieldIndex]) cursosArray[fieldIndex] = []

        return cursosArray[fieldIndex].push(...cursos[key].map(i=>cursoId))
      } else {
        //curso normal de primeira order
        if (!cursosArray[fieldIndex]) cursosArray[fieldIndex] = []

        return cursosArray[fieldIndex].push(cursoId)
      }
    })

    const price = cursosArray.map(fieldArray=>{
      return fieldArray.reduce((acc,item,index)=>{
        const isFirstTimePassing = fieldArray.findIndex(i=>i==item) == index
        if (!isFirstTimePassing) return acc

        const cursoFull = cursosAllData.find(i=>i.id === item)
        if (cursoFull?.combos) {
          const combosLength = cursoFull.combos.length
          const cursosLength = fieldArray.filter(i=>i == item).length
          console.log(combosLength,cursosLength)
          if (combosLength <= cursosLength) { // se nao tiver pacote fica mesmo preço que o combo mais caro
            return acc + cursoFull.combos[combosLength-1].price
          } else {
            return acc + cursoFull.combos[cursosLength-1].price
          }
        }
      }, 0)
    })

    return price // [80,90,...]
  }

  return (
    <SellingContext.Provider value={{ onCalcUserPrice, dataUser, setDataUser, cursos, setCursos, permissions, setPermissions, prices, setPrices, fieldEdit, setFieldEdit,subCursos, setSubCursos }}>
        <ModalFullScreen open={open} onClose={onClose} infoModal={infoModal} onGoBack={onGoBack}>
          <Container>
              <GridContainer
                noValidate
                ref={formRef}
                onSubmit={handleSubmit}
              >

                <InputsEmail>
                  <HeaderModal
                    center
                    text={!isAddClient
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
                      isAddClient={isAddClient}
                      email={email}
                  />
                  )} */}
                </InputsEmail>

                <SideEmail
                  isAddClient={isAddClient}
                />
                <CheckoutButton
                  prices={prices}
                />
              </GridContainer>
            </Container>
          </ModalFullScreen>
      </SellingContext.Provider>
  );
}
