import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import AiOutlineClose from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { SendEmailVerification,ReloadUser,LogOut } from '../services/firebaseAuth';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useLoaderScreen } from '../context/LoaderContext';
import { useLoaderDashboard } from '../context/LoadDashContext';

const Container = styled.div`
  display: flex;
  position:relative;
  padding:30px;
  height: 100vh;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Images = styled.img`
  height:50px;
  resize:cover;
  margin-top:-90px;
  margin-bottom:40px;
`;

const Title = styled.p`
  font-size:3rem;
  font-weight: bold;
  margin-bottom:20px;
  color: ${({theme})=>theme.palette.text.primary};

`;

const SubTitle = styled.p`
  font-size:1rem;
  margin-bottom:30px;
  max-width:550px;
  text-align: center;
  color: ${({theme})=>theme.palette.text.primary};
`;

const ButtonContinue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(-10deg, ${({theme})=>theme.palette.primary.main}, ${({theme})=>theme.palette.primary.light});
  padding:12px 40px;
  border-radius:5px;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.22);
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.23);
  font-weight: bold;
  color: ${({theme})=>theme.palette.primary.contrastText};
  user-select:none;
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -webkit-touch-callout:none;
  transition: filter 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    /* opacity:0.8; */
    filter: brightness(0.85);
  }
`;

const ResendLink = styled.p`
  font-size:0.87rem;
  /* text-decoration:underline; */
  margin-top:10px;
  color: ${({theme})=>theme.palette.text.primary};
  cursor: pointer;
  /* word-spacing:4px; */
  letter-spacing:1px;

  &:hover {
    opacity:0.8;
  }
`;


const Verification = () => {

  const notification = useNotification();
  const { setLoad } = useLoaderScreen();
  const { setLoaderDash } = useLoaderDashboard();
  const { currentUser, setCurrentUser } = useAuth()
  // const [int, setInt] = useState(null)
  // const [clear, setClear] = useState(null)

  const onFocus = () => {
    console.log('focus')
    // clearInterval(int)

    // const interval = setInterval(() => {
    //   console.log('reload')
    //   handleConfirm({isReload:true})
    // }, 5000);

    handleConfirm({isReload:true})
    // setInt(interval)
  }

  // const onBlur = () => {
  //   console.log('blur')
  //   setClear(Math.random)
  // }

  useEffect(() => {
    if (document.hasFocus()) onFocus()

    setLoaderDash(false)
    window.addEventListener("focus", onFocus)
    // window.addEventListener("blur", onBlur)

    return () => {
      console.log('remove listenier')
      window.removeEventListener("focus", onFocus)
      // window.removeEventListener("blur", onBlur)
    }

  }, [])

  // useEffect(() => {
  //   return () => {
  //     clearInterval(int)
  //   }
  // }, [])

  // useEffect(() => {
  //   clearInterval(int)
  //   return () => {
  //     clearInterval(int)
  //   }
  // }, [clear])

  const onError = (error) => notification.error({message:error})

  function handleLogout() {
    const onLogout = () => setTimeout(() => setLoad(false), 1000);
    // clearInterval(int)

    setLoad(true)
    LogOut(onLogout,onError)
  }

  function handleConfirm({isReload}) {
    const onReloadSuccess = (user) => {
      console.log(user)
      console.log(currentUser)
      if (user?.emailVerified) {
        console.log('true',user.emailVerified)
        setCurrentUser({...currentUser,emailVerified:user.emailVerified})
      }
      else if (!isReload) notification.warn({message:'Email ainda não foi verificado.'}) //se nao for do interval
    }

    ReloadUser(onReloadSuccess,onError)
  }

  function handleSentLink() {
    const onSentLinkSuccess = () => notification.success({message:'Email de verificação enviado com sucesso!'})

    SendEmailVerification(onSentLinkSuccess,onError)
  }

  return (
    <Container >
      <IconButton onClick={handleLogout} style={{position:'absolute',top:20,left:20}} >
        <ArrowBackIcon style={{fontSize:30}} />
      </IconButton>
      <Images src="/images/logoRealiza.png" alt="logo" />
      {/* <div style={{display:'flex',backgroundColor:'#fff',padding:'20px 40px',borderRadius:'15px',flexDirection:'column',alignItems:'center'}}> */}
      <Title>Confirme o seu e-mail</Title>
      <SubTitle>Um email de verificação foi enviado para sua caixa de entrada e/ou SPAM, acesse o link  de confirmação contido nele para prosseguir com seu cadastro.</SubTitle>
      <ButtonContinue  onClick={handleConfirm}>
        Confirmar
      </ButtonContinue>
      <ResendLink  onClick={handleSentLink}>Reenviar link</ResendLink>
      {/* </div> */}
    </Container>
  );
};

export default Verification;
