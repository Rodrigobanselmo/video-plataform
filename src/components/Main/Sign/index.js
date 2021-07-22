import React, {useState,useRef,useEffect} from 'react';
import Collapse from '@material-ui/core/Collapse';
import Sign, {PolicyTerms,ContinueButton} from './comp'
import { Base, Title,Form} from './styles';
import {handleEmailChange,handlePasswordChange,confirmHandlePasswordChange} from './valid'
import {onCheckEmail,onLoginUser,onCreateAccount,onRecoveryEmail} from './func'
import { useHistory } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import {useLoaderScreen} from '../../../context/LoaderContext'
import useFade from '../../../hooks/useFadeInOut'
import useTimeOut from '../../../hooks/useTimeOut';
import {useNotification} from '../../../context/NotificationContext'
import {DASHBOARD} from '../../../routes/routesNames'
import styled from "styled-components";
import { useLink } from '../../../services/hooks/get/useLink';

const Half = styled.div`
  width: 100%;
  background-color: ${({theme})=> theme.palette.primary.main};

  @media screen and (max-width: 820px) {
    display:none;
  }
`;

export default function SignIn({emailQuery,codeQuery}) {

  const initialState = {
    //emailAddress: emailQuery ? emailQuery:'rodrigobanselmo@gmail.com',
    emailAddress: emailQuery ? emailQuery:'',
    password: '',
    confirmPassword: '',
    warnMessage: {body:'Campo de email não pode ser nulo',type:'none'},
    warnPassMessage: {body:'Campo de senha não pode ser nulo',type:'none'},
    warnConfirmMessage: {body:'Confirme sua senha para continuar',type:'none'},
  }

  const history = useHistory()

  const [error, setError] = useState('');
  const [recoveryModal, setRecoveryModal] = useState(false);
  const [login, setLogin] = useState(false); //tels us with state the component is // Enter-Login-Register
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState(0);

  const [update, setUpdate] = useState(false); // will tell us if need to check the email input

  const inputPass = useRef(null);
  const inputConfirm = useRef(null);

  const { currentUser } = useAuth()
  const {load,setLoad} = useLoaderScreen();
  const { setLoaderDash,  } = useLoaderDashboard();
  const notification = useNotification();

  const [fade,change,fadeInOut] = useFade('Entrar')
  const [onTimeOutReset] = useTimeOut() //to undo an error message and if i sent a new error will erase the old setTimeout to undo it
  const [onTimeOutR,onClearTimeO] = useTimeOut()  //to see if email is valid and if user stopped texting

  const { data:linkData } = useLink(codeQuery?codeQuery:0)
  console.log('linkData',linkData)

  const validCode = Array.isArray(linkData) && linkData.length === 1

  useEffect(() => {
    if (emailQuery) {
      setTimeout(() => {onButtonSign()}, 800);
    }
  }, [])

  useEffect(() => {  //redirect to app if user is logged  and if user email is coming from query it will valid it
    if (currentUser) {
      setLoaderDash(true)
      setTimeout(() => {
        // setLoaderDash(false)
        history.replace(DASHBOARD)
      }, 1000);
    }
  }, [currentUser])

  useEffect(() => {
    if (error && error !== '') onTimeOutReset(()=>setError(''),4000);
  }, [error])

  useEffect(() => {  //when email input is lazy and email is valid will call this checkEmail func
    update && onTimeOutR(onButtonSign,1500)
  }, [update])

  function onChangeAuthMethod(type) { //it will change the title of the form box
    let message= 'Entrar'
    if (type === 'register') message = 'Cadastro'
    else if (type === 'login') message = 'Login'
    fadeInOut(()=>{setLogin(type)},message)
  }

  const onButtonSign = (event) => {
    event && event?.preventDefault && event.preventDefault();
    if (!loading) {
      if (login === false ) {
        onCheckEmail({data,setData,setLoading,setError,onChangeAuthMethod,inputPass,onErrorNotification,validCode})
        onClearTimeO()
      } else if (login === 'login') {
        onLoginUser({data,setLoad,setLoaderDash,setError,onErrorNotification})
      } else if (login === 'register') {
        if (!checked) return setError('Preencha todos os campos acima!')
        onCreateAccount({data,setLoad,setLoaderDash,setError,onErrorNotification,validCode,linkData:linkData[0]})
      }
    }
  };

  function onSentRecoveryEmail() {
    onRecoveryEmail({data,setLoad,setError,onSuccessNotification,onErrorNotification,setRecoveryModal})
  }

  function onSetEmailAddress(value) {
    handleEmailChange(value,data,setData,setUpdate,onClearTimeO)
  }

  function onSetPassword(value) {
    handlePasswordChange(value,data,setData)
  }

  function onSetConfirmPassword(value) {
    confirmHandlePasswordChange(value,data,setData)
  }


  function onFocusEmail(value) { //every time I focus the email will disappear the others inputs
    if (login !== false) {
      setData({...initialState,emailAddress:value})
      setLogin(false)
    }
  }

  function onErrorNotification(error)  {
    notification.error({message: error})
  }

  function onSuccessNotification(message)  {
    notification.success({message})
  }

  return (
    <div style={{display:'flex'}}>
    {/* <Sign.Logo/> */}
    <Half ></Half>
    <Sign >
    {/* <Sign.VideoBackground/> */}
    <Form style={{transform: 'scale(1)'}} >
        <Title fade={fade}>{change}</Title>
        <Collapse timeout={1000} in={error && error !== '' ? true : false}>
          <Sign.Errors error={error}/>
        </Collapse>
        <div
          style={{position:'relative'}}
        >
          <Sign.InputEmail
            loading={loading}
            data={data}
            onSetEmailAddress={onSetEmailAddress}
           /*  onBlurEmail={onBlurEmail} */
            onFocusEmail={onFocusEmail}
            onKerPress={({key})=>key==='Enter' && onButtonSign()}
            />
          <Sign.InputPass
            inputPass={inputPass}
            data={data}
            loading={loading}
            login={login}
            onSetPassword={onSetPassword}
            onKerPress={({key})=>key==='Enter' && (login === 'register' ? inputConfirm.current.focus() : onButtonSign())}
            />
          <Sign.InputConfirmPass
            inputConfirm={inputConfirm}
            data={data}
            onSetConfirmPassword={onSetConfirmPassword}
            login={login}
            loading={loading}
            />
            <Sign.ForgotPassword
              login={login}
              setRecoveryModal={setRecoveryModal}
            />
            <PolicyTerms
              handleChange={()=>setChecked(!checked)}
              checked={checked}
              login={login}
            />
          <ContinueButton
            handleSignIn={onButtonSign}
            login={login}
            data={data}
          />
        </div>
        {/* <div onClick={() => onLoginUser({data,setLoad,setError,onErrorNotification})}>jio</div> */}
        <Sign.Duvida/>
      </Form>
      <Sign.RecoveryModal email={data.emailAddress} onSentRecoveryEmail={onSentRecoveryEmail} setRecoveryModal={setRecoveryModal} recoveryModal={recoveryModal} />
    </Sign>
    </div>
  );
}





