import styled, {css, keyframes} from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { BsCheckCircle,BsExclamationTriangle,BsXOctagon,BsInfoCircle } from 'react-icons/bs';

export const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index:-1;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(rgba(0, 0, 0, 0.2)),
        to(rgba(0, 0, 0, 0.2))
      ),
      -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.2)), to(transparent));
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.6) 100%
      ),
      linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
    z-index: 2;
  }
`;


export const IconCheck = styled(BsCheckCircle)`
  color: green;
  margin-right: 5px;
`;
export const IconWarn = styled(BsExclamationTriangle)`
  color: #B09F10;
  margin-right: 5px;
`;
export const IconError = styled(BsXOctagon)`
  color: #e91c1c;
  margin-right: 5px;
`;

export const DivIcon = styled.div`
  position: absolute;
  opacity:${({ show }) => (show ? 1 : 0)};
  top: ${({ confirm }) => (confirm ? '8px' : '8px')};
  right: 7px;
  display:flex;
  justify-content:center;
  align-items:center;
  transition: opacity 0.5s ease;
  user-select: none;
  overflow: hidden;
  z-index:11;
`;


export const Background = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content:center;
  flex-direction: column;
  background-color:${({theme})=> theme.palette.background.paper};

`;

export const SocialLogo = styled(Link)`
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: bold;

  &:hover {
    color: #fff;
    transform: scale(1.02);
    transition: 0.15s ease-out;
    text-decoration: none;
  }

span {
  color:#d9560b;
}

`;

export const Container = styled.div`
  display: flex;
  height: 80px;
  margin-bottom:-80px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 24px;
  align-self: center;
  max-width: 1100px;

`;

const slideIn = keyframes`
  from {
    transform: scale(0.4);
  }

  to {
    transform: scale(0.9);
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({theme})=> theme.palette.background.paper};
  border-radius: 30px;
  padding: 30px 50px 30px 50px;
  max-width: 480px;
  margin:0 15px;
  align-self:center;
  -webkit-box-shadow: 1px 1px 3px 6px rgba(51,51,51,0.2);
  box-shadow: 1px 1px 5px 4px rgba(51,51,51,0.2);
  animation: ${slideIn} 1.2s ease-in;

`;

export const Error = styled.div`
  background: ${({theme})=> theme.palette.background.attention};
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  margin: 0 0 16px;
  padding: 10px 20px;
`;

export const Base = styled.div`
  display: flex;
  flex-direction: column;
  position:relative;
`;

export const Title = styled.h1`
  color: ${({theme})=> theme.palette.text.secondary};
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 33px;
  opacity: ${({fade})=>(fade===true ? 1 : 0)};
  transition: opacity 0.40s ease-out;

`;

export const Text = styled.p`
  color: #737373;
  font-size: 16px;
  font-weight: 500;
  opacity: ${({fade})=>(fade===true ? 1 : 0)};
  transition: opacity 0.40s ease-out;

`;

export const TextForgotten = styled.p`
  font-size: 12.5px;
  font-weight: 500;
  margin-top:-13px;
  margin-bottom:17px;
  transition: all 0.85s ease-out;
  z-index:1000;

  ${props => props.login !== 'login' && css`
    display:none;
    font-size: 20.5px;
  `}

`;

export const TextSmall = styled.p`
  margin-top: 10px;
  font-size: 13px;
  text-align: justify;
  line-height: normal;
  color: #8c8c8c;

`;

export const LinkButton = styled(Link)`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color:#d9560b;
    transition: 0.15s ease-out;
  }
`;

export const TextButton = styled.span`
  color: ${({theme})=> theme.palette.text.secondary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color:${({theme})=> theme.palette.primary.mainBlue};
    transition: 0.15s ease-out;
  }
`;

export const Input = styled.input`
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 4px;
  border: 0;
  color: #000;
  height: 40px;
  flex:1;
  line-height: 50px;
  padding: 5px 20px;
  margin-bottom: 20px;
  padding-right:33px;
  z-index:9;
  opacity:1;

  &:focus {
  border-color:#262626;
  border-style:solid;
  border-width:1px;
}

`;

export const InputPassword = styled(Input)`
    opacity:${({login})=>((login == 'login' || login === 'register') ? 1 : 0)};
    transform: ${({login})=>(!login ? 'translateY(-70px)' : '0px')};
    margin-bottom:${({login})=>(!login ? '-70px' : '20px')};
    transition: all 1s ease-out;
    z-index:8;
    height:${({login})=>(!login ? '0px' : '')};
    width:100%;
`;

export const InputConfirm = styled(Input)`
    opacity:${({login})=>(login === 'register'  ? 1 : 0)};
    transform: ${({login})=>(login === 'register' ? '0px' : 'translateY(-50px)')};
    margin-bottom:${({login})=>(login === 'register' ? '0px' : '-70px')};
    height:${({login})=>(!login ? '0px' : '')};
    transition: all 1s ease-out;
    z-index:7;
    width:100%;
    overflow:hidden;
`;


export const Submit = styled.button`
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 5px 0;
  padding: 10px;
  width:100%;
  border: 0;
  background: ${({ theme }) => theme.palette.primary.main};
  margin-top:${({login})=>(login === 'register' ? '20px' : '0px')};
  color: white;
  cursor: pointer;
  z-index:10;
  transition: filter 0.2s;

  &:disabled {
    color: #fff;
    background:  ${({ theme }) => theme.palette.primary.main};
  }

  &:hover {
    filter: brightness(0.95);
  }


`;
export const Google = styled.button`
  background: '#fff';
  display:flex;
  position:relative;
  align-items:center;
  justify-content:center;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px 0 20px;
  padding: 16px;
  font-weight: bold;
  border: 0;
  color: '#000';
  cursor: pointer;

  img {
  width:25px;
  height:25px;
  margin-right:10px;
  }
`;
