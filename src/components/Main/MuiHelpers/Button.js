import Button from '@material-ui/core/Button';
import styled, {css} from "styled-components";
import { lighten,darken } from "@material-ui/core/styles";

//<CancelButton onClick={onClose} style={{  marginRight:'15px'}} variant="outlined" >
//<ContinueButton onClick={onAction} >

export const CancelButton = styled(Button)`
  && {
    padding: 8px 10px;
    border-radius: 8px;
    min-width: 90px;
    text-transform: none;
    border: 1px ${({theme})=>theme.palette.background.line} solid;
    color:${({theme})=>theme.palette.type !== 'dark'?theme.palette.text.secondary:theme.palette.text.primary};
    font-weight:bold;

    &:hover {
      background-color: transparent;
    }

    > .MuiTouchRipple-root span {
      background-color: #00000044;
    }
  }
`;

export const ContinueButton = styled(Button)`

  && {
    padding: 8px 10px;
    border-radius: 7px;
    min-width: ${(props)=> props.minwidth ? props.minwidth : '90px'};
    color:${({theme})=>theme.palette.primary.contrastText };
    font-weight:bold;
    text-transform: none;
    border: none;
    background-color: ${(props)=> props.primary ? props.theme.palette.primary.main : props.theme.palette.background.attention};
    transition: all 0.5s ease;
    opacity:1;


    &:hover {
      background-color: ${(props)=> props.primary ? props.theme.palette.primary.main : props.theme.palette.background.attention};
      filter: brightness(0.95);
      transition: all 0.2s ease;
    }

    ${props => props.primary && css`
      box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.12);
      -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.13);
      background-image: linear-gradient(-10deg, ${({theme})=>theme.palette.primary.main}, ${({theme})=>theme.palette.primary.light});
    `};

    ${props => props.disable === 'true' && css`
      border: 1px ${({theme})=>theme.palette.background.line} solid;
      background: ${({theme})=>theme.palette.background.inactive};
      opacity:1;
      color:${({theme})=>theme.palette.primary.contrastText};
      pointer-events: none;
      &:hover {
        background-color: ${({theme})=>theme.palette.background.inactive};
      }
    `};

    ${props => props.size === 'medium' && css`
      padding: 8px 12px;
      font-size:16px;
    `};

    ${props => props.primary === 'outlined' && css`
      border: 1px ${({theme})=>theme.palette.background.line} solid;
      color:${({theme})=>theme.palette.text.secondary};
      &:hover {
        background-color: ${({theme})=>theme.palette.background.line};
      }
      background-color: transparent;
      background-image: none;
      ${props => props.disable === 'true' && css`
        color:${({theme})=>theme.palette.text.third};
        font-weight:${({theme})=>'normal'};
      `};
    `};

    > .MuiTouchRipple-root span {
      background-color: ${({theme})=>'#ffffff44'};
    }
  }

`;
