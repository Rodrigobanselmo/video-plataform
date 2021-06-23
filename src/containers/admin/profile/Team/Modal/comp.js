import React, {useState} from 'react';
import {Icons} from '../../../../../components/Icons/iconsDashboard';
import {InputEmail,EmailContainer,TypeContainer,Icon,AddAnother} from './style';
import {ModalMui, ModalFullScreen} from '../../../../../components/Main/MuiHelpers/Modal'
import {BootstrapTooltip} from '../../../../../components/Main/MuiHelpers/Tooltip'
import IconButton from '../../../../../components/Main/MuiHelpers/IconButton';
import RichSelect from '../../../../../components/Dashboard/Components/MultUsage/RichSelect'
import useTimeOut from '../../../../../hooks/useTimeOut';
import {EmailVerification} from '../../../../../helpers/StringVerification';
import {ContinueButton} from '../../../../../components/Main/MuiHelpers/Button'
import {UserContainer,UserAvatar,GroupIcon,TextNameEmail} from '../../../../../components/Dashboard/Components/Standard/Avatar'
import Input, {InputEnd,InputUnform,SelectedEnd} from '../../../../../components/Main/MuiHelpers/Input'
import Checkbox from '@material-ui/core/Checkbox';
import {HeaderPage,Page,Container,InputsContainer,Title,SubTitle,IconCloseFull,IconGoBackFull} from '../../../../../components/Dashboard/Components/Standard/PageCarousel'
import {HeaderForm,FormContainer,SubTitleForm,TitleForm,DividerForm,AddAnotherForm,ButtonForm} from '../../../../../components/Dashboard/Components/Form/comp'
import {NumberFormatCNPJ,NumberOnly,RGFormat,NumberFormatOnly,NumberFormatCEP, NumberFormatCPF,NumberFormatTel,NumberFormatCell} from '../../../../../lib/textMask'
import {ModalButtons} from '../../../../../components/Main/MuiHelpers/ModalButtons'
import * as Yup from 'yup'
import {estados} from '../../../../../constants/geral'
import NewTabs, {TabPanel} from '../../../../../components/Main/MuiHelpers/NewTabs'
import { ProfessionForm, UserForm,AddressForm, BankForm, PermissionForm } from './form'
import styled from "styled-components";
import { useSelector,useDispatch } from 'react-redux'

const ButtonEditar = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    opacity:0.7;
    text-decoration: underline;
    /* filter: brightness(0.95); */
  }

  &:active {
    opacity:0.5;
    /* filter: brightness(0.95); */
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

export default function AddModal({children, ...restProps }) {
    return (
        <ModalFullScreen {...restProps}>
          <Container>
            {children}
          </Container>
        </ModalFullScreen>
    );
}

AddModal.Header =  function Header(props) {
  return(
    <HeaderPage center={props.center} >
        <Title>{props.text}</Title>
        {props.subText && <SubTitle>{props.subText}</SubTitle>}
    </HeaderPage>

  )
}

export function Type(props) {

  const types = [];
  props.userTypes.sort().map((item)=>{
    if (item?.name) types.push(item.name)
  })

  function setSelected(user,type) {
    const allEmails = [...props.emails]
    let index = props.emails.findIndex(i=>i?.email && i.email===user.email)
    allEmails[index].type = type
    allEmails[index].access = props.userTypes[props.userTypes.findIndex((i)=>i.name===type)].access
    allEmails[index].icon = props.userTypes[props.userTypes.findIndex(i=>i?.name && i.name===type)].icon
    props.setEmails(allEmails)
  }

  return(
    <div style={{marginBottom:25,width:'100%'}}>
      {props.noRepeatEmails.map((user,index)=>(
        <TypeContainer key={index} className={'rowCenter'}>
        <UserContainer >
            <UserAvatar background style={{marginLeft:0}} >
                <GroupIcon style={{fontSize:28}} type={user?.icon ? user.icon  : 'Add'}/>
            </UserAvatar>
            <TextNameEmail style={{textTransform:'lowercase'}} >{user.email}</TextNameEmail>
        </UserContainer>
        <ButtonEditar onClick={()=>props.onEditForm(user.email)}>
          <span>
            editar
          </span>
          <Icons style={{fontSize:20}} type={'KeyboardArrowRightIcon'} />
        </ButtonEditar>
        {/* <RichSelect setSelected={(type)=>setSelected(user,type)} selected={user.type !=='' ? user.type : 'Selecione'} attention dataToSelect={types}/> */}
      </TypeContainer>
      ))}
    </div>

  )
}

AddModal.EmailInput =  function EmailInput({numInput,setNumInput,setEmails,emails,onCheckUser,notification,companyId}) {

  const [onTimeOut,onClearTime] = useTimeOut()

  const addEmail = (index) => (event) => {
    onClearTime()
    onTimeOut(()=>checkEmail(index,event.target.value.toLowerCase()),1000)
    let allEmails = [...emails]
    if (event.target.value.toLowerCase() && event.target.value.length > 10) {
      allEmails[index] = {email:event.target.value.toLowerCase(), status:'Load',type:'',message:'Carregando...'}
    } else {
      allEmails[index] = {email:event.target.value.toLowerCase(), status:'none',type:'',message:''}
    }
    setEmails(allEmails)
  }

  const checkEmail = (index,value) => {
    let allEmails = [...emails]

    if (EmailVerification(value)) {
      if (allEmails[index].email !== value) {
        allEmails[index] = {...allEmails[index],email:value, status:'Load',message:'Email válido',type:''}
        setEmails(allEmails)
        onCheckUser(value,companyId,index,setEmails,emails,notification)
      }
    } else if (value && value.length > 5) {
      allEmails[index] = {...allEmails[index],email:value, status:'Warn',message:'Email mal formatado',type:''}
      setEmails(allEmails)
    } else {
      allEmails[index] = {...allEmails[index],email:value, status:'none',message:'',type:''}
      setEmails(allEmails)
    }
  }


  return(
    <EmailContainer>
      {[...Array(numInput)].map((i,index)=>(
        <Input
          key={index}
          title={emails[index]?.message ?? ''}
          status={emails[index]?.status && emails[index].status}
          icon={emails[index]?.status && emails[index].status}
          validation={(emails && emails[index] && emails[index]?.status && (emails[index].status === 'Check' || emails[index].status === 'Warn' || emails[index].status === 'Load'))}
          onBlur={({target})=>checkEmail(index,target.value)}
          onChange={addEmail(index)}
          size={'small'}
          label="Email"
          variant="outlined"
        />
      ))}
      <AddAnother onClick={()=>setNumInput(numInput=>numInput+1)}><p>Adicionar Outro</p></AddAnother>
    </EmailContainer>
  )
}

AddModal.Continue =  function Continue({disable,setPosition,setInfoModal,second,onSendRequest,notification}) {

  function onClickContinue() {
    setPosition(2)
    setInfoModal({title:'Você tem certeza?',text:'Ao sair você irá perder as informaçoes inseridas anteriormente.'})

/*     setTimeout(() => {
      notification.info({message:'Email na secção anterios estão com formatação inválida',modal:true})
    }, 1000); */
  }

  return(
    <ContinueButton primary={'true'} onClick={second?onSendRequest:onClickContinue} size={'medium'} disable={`${disable}`}>
      {second ?
      <p>Convidar Membros</p>
      :
      <p>Continuar</p>
      }
    </ContinueButton>
  )
}

export function Form({setUnform,notification,unform,onForm,editEmail}) {

  const [tabValue, setTabValue] = React.useState(0);
  const tabsLabel = ['Permissões','Dados Pessoais','Dados de Endereço','Dados Bancário','Dados Profissionais']
  const [banks, setBanks] = useState([])
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)

  const unformEmail = unform[editEmail]?unform[editEmail]:{}
  console.log(unformEmail,unformEmail?.address)

  const onSaveUser = (unformData) => {
    console.log('unformEmail',{...unform,[editEmail]:{...unform[editEmail],...unformData}})
    dispatch({ type: 'SAVE', payload: false })
    setUnform({...unform,[editEmail]:{...unform[editEmail],...unformData}})
    notification.success({message:'Dados salvos com sucesso!'})
  }

  const onTabChange = (value) => {
    if (save) notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim? Os dados inseridos serão perdidos.',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
      dispatch({ type: 'SAVE', payload: false })
      setTabValue(value)
    }})
    else setTabValue(value)
  }

  return(
    <NewTabs tabStayle={{minWidth: 120}} tabValue={tabValue} onChange={onTabChange} tabsLabel={tabsLabel} >
      <TabPanel key={0} value={tabValue} index={0} >
        <HeaderPage style={{margin:'20px 0px'}}>
          <p style={{fontSize:18}}>Selecione as permissões de usuário.</p>
        </HeaderPage>
        <PermissionForm notification={notification} unform={unformEmail} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={1} value={tabValue} index={1} >
        {/* <HeaderPage style={{margin:'10px 0px'}}>
          <Title style={{fontSize:18}}>Dados de Endereço</Title>
        </HeaderPage> */}
        <UserForm notification={notification} unform={unformEmail} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={2} value={tabValue} index={2} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <AddressForm notification={notification} unform={unformEmail?.address?unformEmail.address:{}} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={3} value={tabValue} index={3} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <BankForm banks={banks} setBanks={setBanks} notification={notification} unform={unformEmail?.bankAccount?unformEmail.bankAccount:{}} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={4} value={tabValue} index={4} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <HeaderPage style={{margin:'20px 0px'}}>
          <p style={{fontSize:18}}>Selecione as profissões e as areas de atuação.</p>
        </HeaderPage>
        <ProfessionForm notification={notification} unform={unformEmail} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
    </NewTabs>
  )
}
