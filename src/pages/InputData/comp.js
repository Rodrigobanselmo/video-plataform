import React, {useState} from 'react';
import clsx from 'clsx';
import { lighten, makeStyles,withStyles } from '@material-ui/core/styles';
import {Icons} from '../../components/Icons/iconsDashboard';
// import {ModalMui, ModalFullScreen} from '../../components/Main/MuiHelpers/Modal'
import {TotalNumVerification} from '../../helpers/StringVerification';
import {ContinueButton} from '../../components/Main/MuiHelpers/Button'
import IconButton from '../../components/Main/MuiHelpers/IconButton';
import {HeaderPage,Page,Container,InputsContainer,Title,SubTitle,IconCloseFull,IconGoBackFull} from '../../components/Dashboard/Components/Standard/PageCarousel'
import Checkbox from '@material-ui/core/Checkbox';
import {FormLabel,PoliticsContainer,AvatarInput} from './styles'
import useTimeOut from '../../hooks/useTimeOut';
import Input, {InputEnd,InputUnform,SelectedEnd} from '../../components/Main/MuiHelpers/Input'
import {HeaderForm,FormContainer,SubTitleForm,TitleForm,DividerForm,AddAnotherForm,ButtonForm} from '../../components/Dashboard/Components/Form/comp'
import {NumberFormatCNPJ,NumberOnly,NumberMoney,RGFormat,NumberFormatOnly,NumberFormatCEP, NumberFormatCPF,NumberFormatTel,NumberFormatCell} from '../../lib/textMask'
import {ModalButtons} from '../../components/Main/MuiHelpers/ModalButtons'
import * as Yup from 'yup'
import {estados} from '../../constants/geral'
import {onCheckCEP} from './func'
import styled from "styled-components";
import axios from "axios";
import { SettingsPhoneTwoTone } from '@material-ui/icons';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {EspecialSelector} from '../../components/Main/MuiHelpers/EspecialSelector'
import {filterObject} from '../../helpers/ObjectArray'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabelCheck from '@material-ui/core/FormLabel';
import {keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../../helpers/StringHandle';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';

const PhoneDiv = styled.div`
  padding: 12px 15px;
  border-radius: 4px;
  border: 1px solid #9f9fab99;
  width: 100%;
  margin:10px 0 20px 0;
  position:relative;

  &:after {
  position: absolute;
  text-align: center;
  content: "Celular";
  font-size: 13px;
  top: -9px;
  left: 10px;
  height: 10px;
  width: 50px;
  background-color: #fff;
  color: ${({theme})=>theme.palette.text.secondary};
}
`;

const Label = styled(FormControlLabel)`
&&& .MuiFormControlLabel-label	{
  font-size:14px;
}
`;

const AddButtonActivitie = styled.div`
  margin:5px auto 20px 26px;
  padding:0px 10px 2px;
  display:inline-block;
  border-radius:10px;
  border: 1px solid ${({theme})=> theme.palette.background.line};
  background-color: ${({theme})=> theme.palette.primary.mainBlue};
  cursor: pointer;
  span {
    margin:0;
    padding:0;
    font-size:12px;
    color: ${({theme})=>theme.palette.primary.contrastText};
  }

  &:hover {
    opacity:0.7;
    /* filter: brightness(0.95); */
  }

  &:active {
    opacity:0.8;
    /* filter: brightness(0.95); */
  }
`;


export default function PageWrapper({children, ...restProps }) {
    return (
        <Page {...restProps}>
          <Container>
            {children}
          </Container>
        </Page>
    );
}

PageWrapper.IconClose =  function Header({onLogout,notification,setLoad,infoModal}) {

    return(
    <IconCloseFull >
        <IconButton onClick={()=>notification.modal({title: infoModal.title,text:infoModal.text,open:true,onClick:()=>onLogout({setLoad,notification})})} aria-label="close" icon={'Close'}/>
    </IconCloseFull>
  )
}

PageWrapper.IconBack =  function Header({setPosition,setInfoModal}) {

    function onGoBack() {
        setPosition(position=>position-1)
    }

  return(
    <IconGoBackFull >
        <IconButton onClick={onGoBack} aria-label="goBack" icon={'ArrowBack'}/>
    </IconGoBackFull>
  )
}

PageWrapper.Header =  function Header(props) {
  return(
    <HeaderPage center={props.center} >
        {/* <Title>Politicas de Privacidade</Title> */}
        <Title >{props.text}</Title>
        {props.subText && <SubTitle>{props.subText}</SubTitle>}
    </HeaderPage>

  )
}

PageWrapper.Continue =  function Continue({onAddData,checked}) {

  function disable() {
    let resp = false
      resp = checked?false : true
    return resp
  }


  return(
    <ContinueButton primary={'true'} onClick={onAddData} size={'medium'} disable={`${disable()}`}>
      <p>Confirmar</p>
    </ContinueButton>
  )
}

PageWrapper.Politics =  function Continue({setChecked,checked}) {

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return(
    <>
      <PoliticsContainer >
        <h3>Politicas</h3>
        <p style={{textAlign:'justify',margin:'10px 0px 20px 0px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <h3>Seguran</h3>
        <p style={{textAlign:'justify',margin:'10px 0px 20px 0px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <h3>Politicas</h3>
        <p style={{textAlign:'justify',margin:'10px 0px 20px 0px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <h3>Seguran</h3>
        <p style={{textAlign:'justify',margin:'10px 0px 20px 0px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </PoliticsContainer>
      <FormLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          name="checkedB"
          color="primary"
        />
        }
        label="Eu li e concordo com os termos de uso e politicas de privacidade"
      />
    </>
  )
}

export function FirstForm({ onUploadProfile,user,setUnform,unform,notification}) {

  const [value, setValue] = useState(unform.cell)

  // axios.get('https://brasilapi.com.br/api/cnpj/v1/{}').then(res=>{
  //     console.log('res',res.data)
  //   }).catch((error)=>{
  //     console.log('error',error)
  // })

  const formRef = React.useRef()

  const validation = Yup.object({
    name: Yup.string().required('Nome não pode estar em branco.'),
    cpf: Yup.string().trim().length(14,'CPF incompleto').required('CPF não pode estar em branco.'),
    rg: Yup.string().trim().required('RG não pode estar em branco.'),
    // cell: Yup.string().trim().length(15,'Número de celular incompleto').required('Número de celular não pode estar em branco.'),
  })

  console.log('value21: ', value)
  console.log('value1: ', unform.cpf)
  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    console.log('value',value)
    if (!value||(value&&value.length<6)) return notification.warn({message:`Número de celular vazio ou inválido.`})
    try {
      await validation.validate(formData, { abortEarly: false })
      setUnform({...unform,...formData,cell:value})
      console.log('submitted: ', formData)
    } catch (error) {
      console.log('error',error);
      const errors = {}
      console.log('submittedError: ', formData)
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform,value])

  const handleAvatarChange = React.useCallback(
    (event) => {
      if (event.target.files && event.target.files[0]) {
        onUploadProfile(event.target.files[0])
      }
    },
    [],
  );

  return(
    <InputsContainer>
      <FormContainer
         noValidate
         ref={formRef}
         onSubmit={handleSubmit}
      >
        <div style={{display:'flex'}}>
          <AvatarInput>
            {!unform?.photoURL ?
              <div>
                <Icons style={{fontSize:140}} type={`Avatar`}/>
              </div>
            :
              <img src={unform.photoURL} alt={'perfil_photo'} />
            }
            <label htmlFor="avatar">
              <FiCamera />
              <input accept="image/*" type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <div>
            <InputUnform
              width={'100%'}
              name={'name'}
              labelWidth={120}
              label={'Nome Completo'}
              defaultValue={unform?.name}
              status={'Normal'}
              variant="outlined"
              inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
            />
            <InputUnform
              width={'50%'}
              name={'cpf'}
              defaultValue={keepOnlyNumbers(unform?.cpf)}
              labelWidth={30}
              style={{marginRight:20}}
              label={'CPF'}
              variant="outlined"
              inputProps={{placeholder:'000.000.000-00',style: {textTransform: 'capitalize',color:'#000'}}}
              inputComponent={NumberFormatCPF}
            />
            <InputUnform
              width={'50%'}
              name={'rg'}
              defaultValue={keepOnlyNumbers(unform?.rg)}
              labelWidth={20}
              label={'RG'}
              variant="outlined"
              inputProps={{style: {color:'#000'}}}
            />
            <PhoneDiv >
              <PhoneInput
                placeholder="Número de celular"
                value={value}
                defaultCountry="BR"
                numberInputProps={{style: {fontSize:15,paddingLeft:3,border:'none',width:'100%'}}}
                onChange={setValue}
              />
            </PhoneDiv>
          </div>
        </div>
        {/* <InputUnform
          width={'100%'}
          name={'cell'}
          labelWidth={70}
          label={'WhatsApp'}
          statusStart={'WhatsApp'}
          variant="outlined"
          inputProps={{placeholder:'(__) _____-____',style: {color:'#000'}}}
          iconStart={'WhatsApp'}
          inputComponent={NumberFormatCell}
        /> */}
        <InputUnform
          width={'100%'}
          name={'facebook'}
          labelWidth={70}
          defaultValue={unform?.facebook}
          label={'Facebook'}
          statusStart={'Facebook'}
          variant="outlined"
          inputProps={{placeholder:'https://www.facebook.com/realiza.conecta',style: {color:'#000'}}}
          iconStart={'Facebook'}
        />
        <InputUnform
          width={'100%'}
          name={'instagram'}
          labelWidth={75}
          defaultValue={unform?.instagram}
          statusStart={'Instagram'}
          label={'Instagram'}
          iconStart={'Instagram'}
          variant="outlined"
          inputProps={{placeholder:'https://www.instagram.com/realiza.conecta',style: {color:'#000'}}}
        />
        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}

export function SecondForm({ user,setUnform,unform,onSecondForm}) {

  const initialStateData = {
    cep:'',
    status:'',
    message:'',
    type:'',
  }

  const formRef = React.useRef()
  const [data, setData] = useState(initialStateData)
  const [_key, setKey] = useState('') //dados dos email inseridos nos inputs
  const [onTimeOut,onClearTime] = useTimeOut()

  React.useEffect(() => {
    if (data.status == 'Check') setKey(Math.random())
  }, [unform])

  const validation = Yup.object({})

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    try {
      await validation.validate(formData, { abortEarly: false })
      onSecondForm({...unform,address:{...unform.address,...formData.address}})
      window.scrollTo(0, 0);
      console.log('submitted: ', formData)
    } catch (error) {
      console.log('error',error);
      const errors = {}
      console.log('submittedError: ', formData)
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform])

  const onAddCEP = (event) => {
    onClearTime()
    onTimeOut(()=>checkCEP(event.target.value),1000)
    let fullData = {...data}
    if (event.target.value && event.target.value.length > 6) {
      fullData = {...fullData,cep:event.target.value, status:'Load',message:'Carregando...'}
      setData(fullData)
    } else if (fullData.cep){
      fullData = {...fullData, status:'none',message:''}
      setData(fullData)
    }
  }

  const checkCEP = (value) => {
    if (value.length > 7) {
      if (data.cep !== value) {
        setData(data=>({...data,cep:value, status:'Load',message:'Carregando...'}))
        fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setData(data=>({...data,cep:value, status:'Check',message:'Cep válido'}))
          setUnform(unform=>({...unform,address:{...unform.address,
              complemento:data.complemento,
              logradouro:data.logradouro,
              municipio:data.localidade,
              bairro:data.bairro,
              uf:data.uf,
              cep:value
            }
          }))
        });
      }
    }
  }


  return(
    <InputsContainer>
      <FormContainer
         noValidate
         ref={formRef}
         onSubmit={handleSubmit}
         key={_key}
      >
        <InputUnform
        width={'100%'}
        name={`address.cep`}
        defaultValue={keepOnlyNumbers(unform.address?.cep?unform.address.cep:'')}
        labelWidth={33}
        label={'CEP'}
        variant="outlined"
        inputComponent={NumberFormatCEP}
        size={'small'}
        status={data?.status && data.status}
        icon={data?.status && data.status}
        title={data.message}
        validation={(data && data?.status && (data.status === 'Check' || data.status === 'Warn' || data.status === 'Load'))}
        onChange={onAddCEP}
        />
        <InputUnform
          width={'100%'}
          defaultValue={unform.address?.logradouro}
          name={`address.logradouro`}
          labelWidth={75}
          label={'Logradouro'}
          variant="outlined"
        />
        <InputUnform
          width={'50%'}
          defaultValue={unform.address?.bairro}
          name={`address.bairro`}
          labelWidth={50}
          label={'Bairro'}
          variant="outlined"
          style={{marginRight:20}}
        />
        <InputUnform
          width={'15%'}
          name={`address.numero`}
          defaultValue={unform.address?.numero}
          labelWidth={63}
          label={'Número'}
          variant="outlined"
          style={{marginRight:20}}
          inputComponent={NumberFormatOnly}
        />
        <InputUnform
          width={'35%'}
          defaultValue={unform.address?.complemento}
          name={`address.complemento`}
          labelWidth={96}
          label={'Complemento'}
          icon={'Info'}
          variant="outlined"
        />
        <InputUnform
            width={'90%'}
            defaultValue={unform.address?.municipio}
            name={`address.municipio`}
            labelWidth={70}
            label={'Município'}
            icon={'Info'}
            variant="outlined"
            style={{marginRight:20}}
            />
        <SelectedEnd
            width={'10%'}
            labelWidth={25}
            label={'UF'}
            selected={unform.address?.uf?(estados.findIndex(i=>i===unform.address.uf)+1):1}
            setData={(selected)=>setUnform(data=>({...data,address:{...data.address,uf:selected}}))}
            data={estados}
            variant="outlined"
            />
        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}

export function BanksForm({ user,setUnform,unform,notification,setPosition}) {

  const [banks, setBanks] = useState([])
  const [search, setSearch] = useState('')

  function onData2(id) {
    const index = banks.findIndex(i=>i.id==id)
    if (banks[index]) {
      setUnform(data=>({...data,bankAccount:{...data.bankAccount,name:banks[index].text}}))
    }
    return
  }

  React.useEffect(() => {
   if (banks.length == 0) axios.get('https://brasilapi.com.br/api/banks/v1').then(res=>{
      console.log('res',res.data)
      const array = []
      res.data.map((item)=>{
        array.push({id:`${item.fullName} (${item.name})`,text:`${item.fullName} (${item.name})`})
      })
      setBanks(array)
    }).catch((error)=>{
      console.log('error',error)
      // setBanks(res.data)
    })
  }, [])

  const formRef = React.useRef()

  const validation = Yup.object({
    // cell: Yup.string().trim().length(15,'Número de celular incompleto').required('Número de celular não pode estar em branco.'),
  })

  const checkJur = (target) => {
    formRef.current.setFieldValue('cpfOrCnpj', '');
    setUnform(data=>({...data,bankAccount:{...data.bankAccount,juridica:target.value}}))
  }

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    // if (!value||(value&&value.length<6)) return notification.warn({message:`Número de celular vazio ou inválido.`})
    try {
      await validation.validate(formData, { abortEarly: false })
      setUnform({...unform,bankAccount:{...unform.bankAccount,...formData.bankAccount}})
      setPosition(p=>p+1)
      console.log('submitted: ', formData)
    } catch (error) {
      console.log('error',error);
      const errors = {}
      console.log('submittedError: ', formData)
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform])

  const checkCNPJ = (valueRow) => {
    if (unform.bankAccount.juridica!=='true') return ''
    const value = keepOnlyNumbers(valueRow.target.value)
    console.log( value, value.length)
    if (value && value.length == 14) {
      axios.get(`https://brasilapi.com.br/api/cnpj/v1/{${keepOnlyNumbers(value)}`).then(res=>{
        console.log('res',res)
        setUnform(unform=>({...unform,bankAccount:{...unform.bankAccount,
          titular:res.data['razao_social'],cpfOrCnpj:formatCPFeCNPJeCEPeCNAE(valueRow.target.value)}
        }))
        formRef.current.setFieldValue('bankAccount.titular', res.data['razao_social']);
        formRef.current.setFieldValue('bankAccount.cpfOrCnpj', formatCPFeCNPJeCEPeCNAE(valueRow.target.value));
      }).catch((error)=>{
        console.log('error',error)
        notification.warn({message:`CNPJ não encontrado na Receita Federal`})
      })
    }
  }

  var text = {
    "allItemsAreSelected": "Todo os items foram selecionados",
    "noOptions": "Nenhuma opção",
    "search": "Pesquisar...",
    "selectAll": "Selecionar Todos",
    "select": "Items selecionados",
    "selectSomeItems": "Selecione seu banco..."
  }

  return(
    <InputsContainer style={{minHeight:400}}>
      <FormContainer
         noValidate
         ref={formRef}
         key={`${unform.cpf}${unform.name}${unform.bankAccount.titular}`}
         onSubmit={handleSubmit}
      >
        <FormLabelCheck style={{fontSize:15,marginBottom:8}} component="legend">Nome do banco</FormLabelCheck>
        <EspecialSelector
          isSimpleSelection
          override={text}
          defaultValue={unform.bankAccount?.name?[unform.bankAccount?.name]:[]}
          inputStyle={'true'}
          selectedValue={unform.bankAccount?.name}
          hideSelectAll
          width={'100%'}
          onSelectFunction={onData2}
          onSearch={setSearch}
          options={(banks?banks.filter(i=> (search == '' || filterObject(i,search,'text') || filterObject(i,search,'name') )).slice(0,20):[])}
        />
        <FormControl component="fieldset" style={{marginBottom:0,marginTop:30,width:'100%'}}>
          <FormLabelCheck style={{fontSize:15}} component="legend">É conta juridica?</FormLabelCheck>
          <RadioGroup row aria-label="gender" name="gender1" value={unform.bankAccount.juridica} onChange={({target})=>checkJur(target)}>
            <Label value={'false'} control={<Radio size='small' color="primary"/>} label="Não" />
            <Label value={'true'} control={<Radio size='small' color="primary"/>} label="Sim" />
          </RadioGroup>
        </FormControl>

        <InputUnform
          width={'100%'}
          name={'bankAccount.cpfOrCnpj'}
          onChange={checkCNPJ}
          labelWidth={45}
          defaultValue={unform.bankAccount.juridica=='true'?unform.bankAccount?.cpfOrCnpj?keepOnlyNumbers(unform.bankAccount.cpfOrCnpj):'':unform.bankAccount?.cpfOrCnpj?keepOnlyNumbers(unform.bankAccount.cpfOrCnpj):keepOnlyNumbers(unform?.cpf)}
          label={unform.bankAccount.juridica=='true'?'CNPJ':'CPF'}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
          inputComponent={unform.bankAccount.juridica=='true'?NumberFormatCNPJ:NumberFormatCPF}
        />
        <InputUnform
          width={'80%'}
          name={'bankAccount.titular'}
          labelWidth={120}
          label={unform.bankAccount.juridica=='true'?'Razão social':'Nome do titular'}
          style={{marginRight:20}}
          defaultValue={unform.bankAccount.juridica=='true'?unform.bankAccount?.titular?unform.bankAccount.titular:'':unform.bankAccount?.titular?unform.bankAccount.titular:unform.name}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <SelectedEnd
          marginTop={10}
          marginBottom={20}
          width={'20%'}
          labelWidth={100}
          label={'Tipo de conta'}
          selected={unform.bankAccount.type?(['Conta corrente','conta poupança','Conta de pagamentos'].findIndex(i=>i===unform.bankAccount.type)+1):1}
          setData={(selected)=>setUnform(data=>({...data,bankAccount:{...data.bankAccount,type:selected}}))}
          data={['Conta corrente','conta poupança','Conta de pagamentos']}
          variant="outlined"
        />
        <InputUnform
          width={'100%'}
          name={'bankAccount.agencia'}
          defaultValue={unform.bankAccount?.agencia}
          labelWidth={80}
          label={'Agência'}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <InputUnform
          width={'100%'}
          name={'bankAccount.conta'}
          defaultValue={unform.bankAccount?.conta}
          labelWidth={120}
          label={'Conta com digito'}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />

        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}

export function ThirdForm({user,setUnform,notification,unform,onThirdForm}) {

  const initialData = [
    { name: 'Educador Físico',activities:['Opção 1 Educador Físico','Opção 2 Educador Físico']},
    { name: 'Enfereiro',activities:['Opção 1 Enfereiro','Opção 2 Enfereiro']},
    { name: 'Farmacêutico',activities:['Opção 1 Farmacêutico' ,'Opção 2 Farmacêutico']},
    { name: 'Fisoterapeuta',activities:['Opção 1 Fisoterapeuta','Opção 2 Fisoterapeuta']},
    { name: 'Fonoaudiólogo',activities:['Opção 1 Fonoaudiólogo','Opção 2 Fonoaudiólogo']},
    { name: 'Médico',inputs:['CRM'],activities:['Opção 1 Médico','Opção 2 Médico']},
    { name: 'Naturopata',activities:['Opção 1 Naturopata','Opção 2 Naturopata']},
    { name: 'Nutricionista',activities:['Opção 1 Nutricionista','Opção 2 Nutricionista']},
    { name: 'Psicólogo',activities:['Opção 1 Psicólogo','Opção 2 Psicólogo' ]},
    { name: 'Psicopedagogo',activities:['Opção 1 Psicopedagogo','Opção 2 Psicopedagogo']},
  ]

  const oldProfession = []
  if (unform?.profession) {
    unform.profession.map((item)=>{
      if (!oldProfession.includes(item.profession)) oldProfession.push(item.profession)
    })
  }

  const formRef = React.useRef()
  const [data, setData] = useState(unform?.permissions && unform?.permissions.includes('ec') ? [...initialData] : [...initialData.filter(i=>i.name != 'Conector')])
  const [profession, setProfession] = useState([...oldProfession])
  const [activities, setActivities] = useState(unform?.profession?unform.profession:[])
  const [open, setOpen] = useState(false)
  const [newActivit, setNewActivit] = useState('')

  const validation = Yup.object({})

  React.useEffect(() => {
    const newInitial = unform?.permissions && unform?.permissions.includes('ec') ? [...initialData] : [...initialData.filter(i=>i.name != 'Conector')]
    console.log()
    if (unform?.profession) {
      unform.profession.map(item=>{
        initialData.map((array,index)=>{
          if (!array.activities.includes(item.activit) && array.name == item.profession && item.activit) newInitial[index].activities = [...newInitial[index].activities,item.activit]
        })
      })
    }
    setData([...newInitial])
  }, [])

  const handleSubmit = React.useCallback(async (formData) => {

    var arrayError = []
    var novasActivities = [...activities]
    var newFormdata = {...formData}
    Object.keys(formData).map(key=>{
      if (formData[key] == '') arrayError.push(key)
      if (key.split('//').length == 2) {
        const index = novasActivities.findIndex(i=>i.activit == key.split('//')[1] &&i.profession == key.split('//')[0])
        novasActivities[index].price = formData[key].split(',')[1] ? formData[key].split(',')[1].length==2?formData[key]:formData[key]+'0':formData[key]+',00'
        delete newFormdata[key]
      }
    })

    if (arrayError.length>0 && arrayError[0].split('-')[1]) return notification.warn({message:`${arrayError[0].split('-')[1]} não pode estar em branco.`})
    else if (arrayError.length>0) return notification.warn({message:`Informe o preço dos atendimentos selecionados.`})

    formRef.current.setErrors({
    })

    if (profession.length == 0) return notification.warn({message:'Selecione ao menos uma profissão.'})
    if (activities.length == 0) return notification.warn({message:'Selecione ao menos uma atividade de cada profissão.'})
    if (activities.filter((i,index)=>activities.findIndex(fi=>fi.profession==i.profession)==index).length < profession.length ) return notification.warn({message:'Selecione ao menos uma atividade de cada profissão.'})


    try {
      await validation.validate(formData, { abortEarly: false })
      onThirdForm({...unform,...newFormdata,profession:novasActivities})
      console.log('submitted: ', formData,novasActivities)
    } catch (error) {
      console.log('error',error);
      const errors = {}
      console.log('submittedError: ', formData)
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform,activities,profession])


  const handleChangeProffesion = (event,item) => {
    if (!event.target.checked) {
      data.map(i=>{
        if (i.name==item) {
          if (i?.inputs) {
            i.inputs.map(it=>{
              if (unform[`${i.name}-${it}`]) {
                var newUnform = {...unform}
                delete newUnform[`${i.name}-${it}`]
                setUnform({...newUnform})
              }
            })
          }
        }
      })
      setProfession(profession=>[...profession.filter(i=>i!=item)])
      setActivities(activitie=>[...activitie.filter(i=>i.profession!=item)])
    } else {
      setProfession(profession=>[...profession,item])
    }
  };

  const handleChangeActivities = (event,activit,profession) => {
    if (!event.target.checked) {
      setActivities(activitie=>[...activitie.filter(i=>i.activit!=activit&&i.profession!=profession)])
    } else {
      setActivities(activitie=>[...activitie,{activit,profession}])
    }
  };

  const onAddActivit = () => {

    const index = data.findIndex(i=>i.name==open)
    if (!newActivit) return null
    if (data[index].activities.includes(newActivit)) return notification.error({message:'Essa atividade já existe.'})

    var newData = [...data]
    const newActivities = [...data[index].activities,newActivit]
    newData[index].activities = [...newActivities]
    setData([...newData])
  };


  function onCloseModalAdd() {
    setOpen(false)
    setNewActivit('')
  }

  const Ascendent = function (a, b) {
    if (a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
        return 1;
    }
    if (b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
        return -1;
    }
    return 0;
  };

  return(
    <InputsContainer>
      <FormContainer
         noValidate
         ref={formRef}
         onSubmit={handleSubmit}
      >
        <div style={{display:'flex',flexDirection:'column'}}>
          {data.sort(Ascendent).map(item=>{
            return (
              <div key={`${item.name}`} style={{display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',flexDirection:'row',margin:'0 0 10px 0'}}>
                  <Checkbox
                    style={{margin:0,padding:'0 5px 0 0'}}
                    checked={profession.includes(item.name)}
                    size='small'
                    onChange={(event)=>handleChangeProffesion(event,item.name)}
                    name={item.name}
                    color="primary"
                  />
                  <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                    {item.name}
                  </span>
                </div>
                {profession.includes(item.name) &&item?.inputs && item.inputs.length>0 && item.inputs.map((label,indexLabel)=>{
                  return (
                  <div key={`${item.name}-${label}`} style={{margin:'-5px 0 -5px 26px'}}>
                    <InputUnform
                      width={'100%'}
                      defaultValue={unform[`${item.name}-${label}`]?unform[`${item.name}-${label}`]:''}
                      name={`${item.name}-${label}`}
                      labelWidth={45}
                      label={label}
                      variant="outlined"
                      inputComponent={NumberOnly}
                    />
                  </div>
                  )
                })}
                {profession.includes(item.name) && item.activities.sort().map((activit,indexAct)=>{
                  const indexActivitie = activities.findIndex(i=>i.activit == activit&&i.profession == item.name)

                  return (
                    <div key={`${activit}${indexAct}`} style={{display:'flex',flexDirection:'column'}}>
                      <div style={{display:'flex',alignItems:'center',flexDirection:'row',margin:'0 0 10px 26px'}}>
                        <Checkbox
                          style={{margin:0,padding:'0 6px 0 0'}}
                          checked={indexActivitie != -1}
                          size='small'
                          onChange={(event)=>handleChangeActivities(event,activit,item.name)}
                          name={activit}
                          color="primary"
                        />
                        <span style={{zIndex:110,marginBottom:0,marginRight:15,display:'inline-block',marginTop:0}}>
                          {activit}
                        </span>
                        {indexActivitie != -1 &&
                          <InputUnform
                            width={'150px'}
                            defaultValue={activities[indexActivitie]?.price}
                            name={`${item.name}//${activit}`}
                            statusStart={'money'}
                            labelWidth={45}
                            label={'Preço'}
                            variant="standard"
                            inputComponent={NumberMoney}
                          />
                        }
                      </div>
                      {indexAct == item.activities.length-1 &&
                        <AddButtonActivitie onClick={()=>setOpen(item.name)}>
                          <span>Adicionar Outro</span>
                        </AddButtonActivitie>
                      }
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        {/* <InputUnform
          width={'100%'}
          name={`Teste`}
          labelWidth={75}
          label={'Teste'}
          variant="outlined"
        /> */}
        <ButtonForm type='submit' justify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
      <ModalButtons
        open={Boolean(open)}
        disable={false}
        onClick={onAddActivit}
        onClose={onCloseModalAdd}
        title={'Nova Atividade'}
        padding={'large'}
      >
        <div style={{backgroundColor:'#fff',padding:0}}>
          <p style={{marginBottom:15}}>Adicione uma nova atividade para a profissão: <span style={{fontWeight:'bold'}}>{profession}</span>?</p>
          <InputEnd
            width={'100%'}
            onChange={({target})=>setNewActivit(target.value)}
            size={'small'}
            labelWidth={90}
            name={'responsavel'}
            label={'Atividade'}
            title={newActivit}
            variant="outlined"
          />
        </div>
      </ModalButtons>
    </InputsContainer>
  )
}

