import React, {useState} from 'react';
import clsx from 'clsx';
import { lighten, makeStyles,withStyles } from '@material-ui/core/styles';
import {Icons} from '../../../../../components/Icons/iconsDashboard';
// import {ModalMui, ModalFullScreen} from '../../../../../components/Main/MuiHelpers/Modal'
import {TotalNumVerification} from '../../../../../helpers/StringVerification';
import {ContinueButton} from '../../../../../components/Main/MuiHelpers/Button'
import IconButton from '../../../../../components/Main/MuiHelpers/IconButton';
import {HeaderPage,Page,Container,InputsContainer,Title,SubTitle,IconCloseFull,IconGoBackFull} from '../../../../../components/Dashboard/Components/Standard/PageCarousel'
import Checkbox from '@material-ui/core/Checkbox';
import {FormLabel,AvatarInput,PhoneDiv,Label,AddButtonActivitie} from './style'
import useTimeOut from '../../../../../hooks/useTimeOut';
import Input, {InputEnd,InputUnform,SelectedEnd} from '../../../../../components/Main/MuiHelpers/Input'
import {HeaderForm,FormContainer,SubTitleForm,TitleForm,DividerForm,AddAnotherForm,ButtonForm} from '../../../../../components/Dashboard/Components/Form/comp'
import {NumberFormatCNPJ,NumberOnly,NumberMoney,RGFormat,NumberFormatOnly,NumberFormatCEP, NumberFormatCPF,NumberFormatTel,NumberFormatCell} from '../../../../../lib/textMask'
import {ModalButtons} from '../../../../../components/Main/MuiHelpers/ModalButtons'
import * as Yup from 'yup'
import {estados} from '../../../../../constants/geral'
import styled from "styled-components";
import axios from "axios";
import { SettingsPhoneTwoTone } from '@material-ui/icons';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {EspecialSelector} from '../../../../../components/Main/MuiHelpers/EspecialSelector'
import {filterObject} from '../../../../../helpers/ObjectArray'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabelCheck from '@material-ui/core/FormLabel';
import {keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../../../../../helpers/StringHandle';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';

export function UserForm({ onForm,unform,notification,save,dispatch}) {

  const [value, setValue] = useState(unform?.cell?unform.cell:'')
  const [name, setName] = useState(unform?.name?unform.name:'')
  const [cpf, setCPF] = useState(unform?.cpf?keepOnlyNumbers(unform.cpf):'')
  const [rg, setRG] = useState(unform?.rg?keepOnlyNumbers(unform.rg):'')
  const [instagram, setInstagram] = useState(unform?.instagram?unform.instagram:'')
  const [facebook, setFacebook] = useState(unform?.facebook?unform.facebook:'')

  function onConfirm() {
    var addedData = {}
    if (value) addedData.cell = value
    if (name) addedData.name = name
    if (cpf) addedData.cpf = cpf
    if (rg) addedData.rg = rg
    if (instagram) addedData.instagram = instagram
    if (facebook) addedData.facebook = facebook
    onForm({...addedData})
  }

  const onChange = (setState,value) => {
    if (!save) dispatch({ type: 'SAVE', payload: true })
    setState(value)
  }

  return(
    <InputsContainer style={{marginTop:15}}>
      <div styles={{display:'flex',width:'100%',flexWrap:'wrap'}}>
        <InputEnd
          width={'100%'}
          labelWidth={120}
          label={'Nome Completo'}
          value={name}
          onChange={(e)=>onChange(setName,e.target.value)}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <InputEnd
          width={'50%'}
          value={cpf}
          onChange={(e)=>onChange(setCPF,e.target.value)}
          labelWidth={30}
          style={{marginRight:20}}
          label={'CPF'}
          variant="outlined"
          inputProps={{placeholder:'000.000.000-00',style: {textTransform: 'capitalize',color:'#000'}}}
          inputComponent={NumberFormatCPF}
        />
        <InputEnd
          width={'50%'}
          value={rg}
          onChange={(e)=>onChange(setRG,e.target.value)}
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
            onChange={(value)=>onChange(setValue,value)}
          />
        </PhoneDiv>
        <InputEnd
          width={'100%'}
          value={facebook}
          onChange={(e)=>onChange(setFacebook,e.target.value)}
          labelWidth={70}
          label={'Facebook'}
          statusStart={'Facebook'}
          variant="outlined"
          inputProps={{placeholder:'https://www.facebook.com/realiza.conecta',style: {color:'#000'}}}
          iconStart={'Facebook'}
        />
        <InputEnd
          width={'100%'}
          value={instagram}
          onChange={(e)=>onChange(setInstagram,e.target.value)}
          labelWidth={75}
          statusStart={'Instagram'}
          label={'Instagram'}
          iconStart={'Instagram'}
          variant="outlined"
          inputProps={{placeholder:'https://www.instagram.com/realiza.conecta',style: {color:'#000'}}}
        />
        <ButtonForm disable={save?'false':'true'} onClick={onConfirm} jusify='center' primary={'true'} style={{width:'fit-content'}}>
          SALVAR
        </ButtonForm>
      </div>
    </InputsContainer>
  )
}

export function BankForm({ banks,setBanks,onForm,unform,notification,save,dispatch}) {

  const [search, setSearch] = useState('')

  const [name, setName] = useState(unform?.name?unform.name:'')
  const [juridica, setJuridica] = useState(unform?.juridica?unform.juridica:'false')
  const [cpfOrCnpj, setCPfOrCNPJ] = useState(unform?.cpfOrCnpj?unform.cpfOrCnpj:'')
  const [titular, setTitular] = useState(unform?.titular?unform.titular:'')
  const [type, setType] = useState(unform?.type?unform.type:'')
  const [agencia, setAgencia] = useState(unform?.agencia?unform.agencia:'')
  const [conta, setConta] = useState(unform?.conta?unform.conta:'')

  function onData2(id) {
    const index = banks.findIndex(i=>i.id==id)
    if (banks[index]) {
      setName(banks[index].text)
    }
    return
  }

  const checkJur = (target) => {
    setCPfOrCNPJ('');
    setJuridica(target.value)
  }

  const checkCNPJ = (valueRow) => {
    onChange(setCPfOrCNPJ,valueRow.target.value)
    if (juridica!=='true') return ''
    const value = keepOnlyNumbers(valueRow.target.value)
    if (value && value.length == 14) {
      axios.get(`https://brasilapi.com.br/api/cnpj/v1/{${keepOnlyNumbers(value)}`).then(res=>{
        console.log('res',res)
        setTitular(res.data['razao_social'])
      }).catch((error)=>{
        console.log('error',error)
        notification.warn({message:`CNPJ não encontrado na Receita Federal`})
      })
    }
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

  function onConfirm() {
    // setCPfOrCNPJ(formatCPFeCNPJeCEPeCNAE(valueRow.target.value))

    var addedData = {}
    if (name) addedData.name = name
    if (juridica) addedData.juridica = juridica
    if (cpfOrCnpj) addedData.cpfOrCnpj = cpfOrCnpj
    if (type) addedData.type = type
    if (titular) addedData.titular = titular
    if (agencia) addedData.agencia = agencia
    if (conta) addedData.conta = conta
    onForm({bankAccount: {...addedData}})
  }

  const onChange = (setState,value) => {
    if (!save) dispatch({ type: 'SAVE', payload: true })
    setState(value)
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
    <InputsContainer style={{marginTop:15}}>
      <div styles={{display:'flex',width:'100%',flexWrap:'wrap'}}>
        <FormLabelCheck style={{fontSize:15,marginBottom:8}} component="legend">Nome do banco</FormLabelCheck>
        <EspecialSelector
          isSimpleSelection
          override={text}
          defaultValue={name?[name]:[]}
          inputStyle={'true'}
          selectedValue={name}
          hideSelectAll
          width={'100%'}
          onSelectFunction={onData2}
          onSearch={setSearch}
          options={(banks?banks.filter(i=> (search == '' || filterObject(i,search,'text') || filterObject(i,search,'name') )).slice(0,20):[])}
        />
        <FormControl component="fieldset" style={{marginBottom:0,marginTop:30,width:'100%'}}>
          <FormLabelCheck style={{fontSize:15}} component="legend">É conta juridica?</FormLabelCheck>
          <RadioGroup row aria-label="gender" name="gender1" value={juridica} onChange={({target})=>checkJur(target)}>
            <Label value={'false'} control={<Radio size='small' color="primary"/>} label="Não" />
            <Label value={'true'} control={<Radio size='small' color="primary"/>} label="Sim" />
          </RadioGroup>
        </FormControl>
        <InputEnd
          width={'100%'}
          value={keepOnlyNumbers(cpfOrCnpj)}
          onChange={checkCNPJ}
          labelWidth={45}
          label={juridica=='true'?'CNPJ':'CPF'}
          inputComponent={juridica=='true'?NumberFormatCNPJ:NumberFormatCPF}
          inputProps={{style: {color:'#000'}}}
          variant="outlined"
        />
        <InputEnd
          width={'70%'}
          value={titular}
          style={{marginRight:20}}
          onChange={(e)=>onChange(setTitular,e.target.value)}
          label={juridica=='true'?'Razão social':'Nome do titular'}
          labelWidth={120}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <SelectedEnd
          width={'30%'}
          marginTop={10}
          marginBottom={20}
          labelWidth={100}
          label={'Tipo de conta'}
          selected={type?(['Conta corrente','Conta poupança','Conta de pagamentos'].findIndex(i=>i===type)+1):1}
          data={['Conta corrente','conta poupança','Conta de pagamentos']}
          setData={(selected)=>onChange(setType,selected)}
          variant="outlined"
        />

        <InputEnd
          width={'100%'}
          value={agencia}
          onChange={(e)=>onChange(setAgencia,e.target.value)}
          labelWidth={63}
          status={'Normal'}
          label={'Agência'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <InputEnd
          width={'100%'}
          value={conta}
          onChange={(e)=>onChange(setConta,e.target.value)}
          labelWidth={120}
          label={'Conta com digito'}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <ButtonForm disable={save?'false':'true'} onClick={onConfirm} jusify='center' primary={'true'} style={{width:'fit-content'}}>
          SALVAR
        </ButtonForm>
      </div>
    </InputsContainer>
  )
}

export function AddressForm({ onForm,unform,notification,save,dispatch}) {

  const [cep, setCEP] = useState(unform?.cep?unform.cep:'')
  const [logradouro, setLogradouro] = useState(unform?.logradouro?unform.logradouro:'')
  const [bairro, setBairro] = useState(unform?.bairro?unform.bairro:'')
  const [numero, setNumero] = useState(unform?.numero?unform.numero:'')
  const [complemento, setComplemento] = useState(unform?.complemento?unform.complemento:'')
  const [municipio, setMunicipio] = useState(unform?.municipio?unform.municipio:'')
  const [uf, setUF] = useState(unform?.uf?unform.uf:'')

  function onConfirm() {
    var addedData = {}
    if (cep) addedData.cep = cep
    if (logradouro) addedData.logradouro = logradouro
    if (bairro) addedData.bairro = bairro
    if (numero) addedData.numero = numero
    if (complemento) addedData.complemento = complemento
    if (municipio) addedData.municipio = municipio
    if (uf) addedData.uf = uf
    onForm({address: {...addedData}})
  }

  const onChange = (setState,value) => {
    if (!save) dispatch({ type: 'SAVE', payload: true })
    setState(value)
  }

  const checkCEP = (value) => {
    onChange(setCEP,value)
    if (value.length > 7) {
      if (cep !== value) {
        fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setLogradouro(data.logradouro),
          setBairro(data.bairro),
          setComplemento(data.complemento),
          setMunicipio(data.localidade),
          setUF(data.uf)
        });
      }
    }
  }

  return(
    <InputsContainer style={{marginTop:15}}>
      <div styles={{display:'flex',width:'100%',flexWrap:'wrap'}}>
        <InputEnd
          width={'100%'}
          labelWidth={33}
          label={'CEP'}
          value={keepOnlyNumbers(cep)}
          onChange={(e)=>checkCEP(e.target.value)}
          label={'CEP'}
          variant="outlined"
          inputComponent={NumberFormatCEP}
          size={'small'}
        />
        <InputEnd
          width={'100%'}
          value={logradouro}
          onChange={(e)=>onChange(setLogradouro,e.target.value)}
          labelWidth={75}
          label={'Logradouro'}
          variant="outlined"
        />
        <InputEnd
          width={'50%'}
          value={bairro}
          onChange={(e)=>onChange(setBairro,e.target.value)}
          labelWidth={50}
          label={'Bairro'}
          variant="outlined"
          style={{marginRight:20}}
        />
        <InputEnd
          width={'15%'}
          value={numero}
          onChange={(e)=>onChange(setNumero,e.target.value)}
          labelWidth={63}
          label={'Número'}
          variant="outlined"
          style={{marginRight:20}}
          inputComponent={NumberFormatOnly}
        />
        <InputEnd
          width={'35%'}
          value={complemento}
          onChange={(e)=>onChange(setComplemento,e.target.value)}
          labelWidth={96}
          label={'Complemento'}
          variant="outlined"
          icon={'Info'}
        />
        <InputEnd
          width={'90%'}
          value={municipio}
          onChange={(e)=>onChange(setMunicipio,e.target.value)}
          labelWidth={70}
          label={'Município'}
          style={{marginRight:20}}
          variant="outlined"
          icon={'Info'}
        />
        <SelectedEnd
          width={'10%'}
          labelWidth={25}
          label={'UF'}
          selected={uf?(estados.findIndex(i=>i===uf)+1):1}
          setData={(selected)=>onChange(setUF,selected)}
          data={estados}
          variant="outlined"
        />
        <ButtonForm disable={save?'false':'true'} onClick={onConfirm} jusify='center' primary={'true'} style={{width:'fit-content'}}>
          SALVAR
        </ButtonForm>
      </div>
    </InputsContainer>
  )
}

export function PermissionForm({setUnform,notification,unform,onForm,save,dispatch}) {

  const initialData = [
    { name: 'Equipe Técnica',id:'et'},
    { name: 'Equipe Administrativa',id:'ea'},
    { name: 'Equipe de Conexão',id:'ec'},
  ]

  const [permissionsType, setPermissionsType] = useState(unform?.permissions?unform.permissions:['et'])

  const handleChangePermissions = (event,item) => {
    if (!event.target.checked) {
      setPermissionsType(permissionsType=>[...permissionsType.filter(i=>i!=item)])
      if (!save) dispatch({ type: 'SAVE', payload: true })
    } else {
      if (!save) dispatch({ type: 'SAVE', payload: true })
      setPermissionsType(permissionsType=>[...permissionsType,item])
    }
  };

  function onConfirm() {
    onForm({permissions:permissionsType})
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
        <div style={{display:'flex',marginTop:0,flexWrap:'wrap',width:'100%'}}>
          {initialData.sort(Ascendent).map(item=>{
            return (
              <div key={`${item.name}`} style={{display:'flex',flexDirection:'column',width:'33%',minWidth:200}}>
                <div style={{display:'flex',flexDirection:'row',margin:'0 0 10px 0'}}>
                  <Checkbox
                    style={{margin:0,padding:'0 5px 0 0'}}
                    checked={permissionsType.includes(item.id)}
                    size='small'
                    onChange={(event)=>handleChangePermissions(event,item.id)}
                    name={item.name}
                    color="primary"
                  />
                  <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                    {item.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <ButtonForm disable={save?'false':'true'} onClick={onConfirm} primary={'true'} style={{width:'fit-content'}}>
          SALVAR
        </ButtonForm>
    </InputsContainer>
  )
}

export function ProfessionForm({setUnform,notification,unform,onForm,save,dispatch}) {

  const initialData = [
    { name: 'Conector',activities:['Conexão com cliente']},
    { name: 'Educador Físico',activities:['Opção 1 Educador Físico','Opção 2 Educador Físico']},
    { name: 'Enfereiro',activities:['Opção 1 Enfereiro','Opção 2 Enfereiro']},
    { name: 'Farmacêutico',activities:['Opção 1 Farmacêutico iuh iu huiuihhuhuihu iuhuihiuh iuhui' ,'Opção 2 Farmacêutico']},
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
    var novasActivities = [...activities].filter(i=>i.activit!='') //! para caso queria poder definir profissao e nao somente especialidade retira o filter, mas afeta Perfil
    var newFormdata = {...formData}
    Object.keys(formData).map(key=>{
      if (formData[key] == '') arrayError.push(key)
      if (key.split('//').length == 2) {
        const index = novasActivities.findIndex(i=>i.activit == key.split('//')[1] &&i.profession == key.split('//')[0])
        novasActivities[index].price = formData[key].split(',')[1] ? formData[key].split(',')[1].length==2?formData[key]:formData[key]+'0':formData[key]+',00'
        if (novasActivities[index].price === ',00') novasActivities[index].price = ''
        delete newFormdata[key]
      }
    })

    // if (arrayError.length>0 && arrayError[0].split('-')[1]) return notification.warn({message:`${arrayError[0].split('-')[1]} não pode estar em branco.`})
    // else if (arrayError.length>0) return notification.warn({message:`Informe o preço dos atendimentos selecionados.`})

    formRef.current.setErrors({})

    // if (profession.length == 0) return notification.warn({message:'Selecione ao menos uma profissão.'})
    // if (activities.length == 0) return notification.warn({message:'Selecione ao menos uma atividade de cada profissão.'})
    // if (activities.filter((i,index)=>activities.findIndex(fi=>fi.profession==i.profession)==index).length < profession.length ) return notification.warn({message:'Selecione ao menos uma atividade de cada profissão.'})


    try {
      await validation.validate(formData, { abortEarly: false })
      onForm({...newFormdata,profession:novasActivities})
      console.log('submitted: ', newFormdata,novasActivities)
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
      // data.map(i=>{
      //   if (i.name==item) {
      //     if (i?.inputs) {
      //       i.inputs.map(it=>{
      //         if (unform[`${i.name}-${it}`]) {
      //           var newUnform = {...unform}
      //           delete newUnform[`${i.name}-${it}`]
      //           setUnform({...newUnform})
      //         }
      //       })
      //     }
      //   }
      // })
      setProfession(profession=>[...profession.filter(i=>i!=item)])
      setActivities(activitie=>[...activitie.filter(i=>i.profession!=item)])
      if (!save) dispatch({ type: 'SAVE', payload: true })
    } else {
      if (!save) dispatch({ type: 'SAVE', payload: true })
      setProfession(profession=>[...profession,item])
      setActivities(activitie=>[...activitie,{activit:'',profession:item}])
    }
  };

  const handleChangeActivities = (event,activit,profession) => {
    if (!event.target.checked) {
      setActivities(activitie=>[...activitie.filter(i=>i.activit!=activit&&i.profession!=profession)])
      if (!save) dispatch({ type: 'SAVE', payload: true })
    } else {
      if (!save) dispatch({ type: 'SAVE', payload: true })
      setActivities(activitie=>[...activitie,{activit,profession}])
      if (!save) dispatch({ type: 'SAVE', payload: true })
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
        <div style={{display:'inline-flex',marginTop:0,flexWrap:'wrap',alignContent:'center',width:'100%'}}>
          <div>
            {data.sort(Ascendent).map((item,index)=>{
              if ((index+1)>data.length/2) return null
              return (
                <div key={`${item.name}`} style={{width:'45%',minWidth:400,marginRight:50}}>
                  <div style={{display:'flex',flexDirection:'row',margin:'0 0 15px 0'}}>
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
                          <span style={{zIndex:110,marginBottom:0,marginRight:'auto',paddingRight:20,display:'inline-block',marginTop:0}}>
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
          <div>
            {data.sort(Ascendent).map((item,index)=>{
              if ((index+1)<=data.length/2) return null
              return (
                <div key={`${item.name}`} style={{width:'45%',minWidth:400}}>
                  <div style={{display:'flex',flexDirection:'row',margin:'0 0 15px 0'}}>
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
                          <span style={{zIndex:110,marginBottom:0,marginRight:'auto',paddingRight:20,display:'inline-block',marginTop:0}}>
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
        </div>
        <ButtonForm type='submit' primary={'true'} style={{width:'fit-content'}}>
          SALVAR
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

