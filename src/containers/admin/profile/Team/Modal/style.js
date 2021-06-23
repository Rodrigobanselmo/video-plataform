import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import styled, {css} from "styled-components";
import {Icons} from '../../../../../components/Icons/iconsDashboard'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { lighten,darken,fade } from "@material-ui/core/styles";

export const PhoneDiv = styled.div`
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

export const Label = styled(FormControlLabel)`
&&& .MuiFormControlLabel-label	{
  font-size:14px;
}
`;

export const AddButtonActivitie = styled.div`
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


export const FormLabel = styled(FormControlLabel)`
  color: ${({theme})=>theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 20px;
  margin-left: 20px;
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  margin-right: 20px;
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  div {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    background: ${({theme})=>fade(theme.palette.primary.mainLight,0.4)};
    border: 2px solid ${({theme})=>(theme.palette.text.third)};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: ${({theme})=>(theme.palette.primary.main)};
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({theme})=>(theme.palette.primary.contrastText)};
    }
    &:hover {
      background: ${({theme})=>fade(theme.palette.primary.main,0.8)};
    }
  }
`;


export const HeaderPage = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-bottom:30px;

`;

export const Container = styled.div`
    display:flex;
    flex-direction:column;
    overflow-x:hidden;
    justify-content:center;
    align-items:center;
    padding:120px 10vw 120px 10vw;
    min-height: 100vh;
`;
export const EmailContainer = styled.div`
    display:flex;
    flex-direction:column;
/*     max-width:550px; */
    width:100%;
    margin-bottom:20px;
`;
export const Icon = styled(Icons)`
    position:absolute;
    top:25%;
    right:17px;
    cursor:pointer;
    color: ${({theme})=> theme.palette.status.success };


    ${props => props.status === 'Warn' && css`
        color: ${({theme})=> theme.palette.status.fail };
    `}
    ${props => props.status === 'Load' && css`
        top:11%;
        right:17px;
    `}

`;

export const Title = styled.h1`
    font-size:25px;
    color: ${({theme})=> theme.palette.text.primary };
    margin-bottom:10px;
`;

export const SubTitle = styled.p`
    text-align:justify;
    font-size:16px;
    color: ${({theme})=> theme.palette.text.primary };
`;

export const AddAnother = styled.div`
    max-width:fit-content;
    padding:7px 10px;
    border-radius: 5px;
    font-size:13px;
    color: ${({theme})=> theme.palette.text.secondary };
    border-color: ${({theme})=> theme.palette.background.inactive };
    border-width: 1px;
    border-style: solid;
    cursor:pointer;

    &:hover {
        border-color: ${({theme})=> theme.palette.primary.main };
    }
`;

export const ContinueButton = styled.div`
    padding:8px 20px;
    border-radius: 8px;
    font-size:18px;
    font-weight:bold;
    color: ${({theme})=> theme.palette.text.primary };
    background-color: ${({theme})=> theme.palette.background.inactive };
    cursor:pointer;


    ${props => props.active === 'true' && css`
    background-color: ${({theme})=> theme.palette.primary.main };
        &:hover {
            transform: scale(1.02);
            opacity: 0.7;
        }
    `}
`;

export const GroupIcon = styled(Icons)`
    font-size:50px;
    color:${({theme})=>theme.palette.text.primary};
`;

export const TypeContainer = styled.div`
  width: 100%;
  justify-content:space-between;
  border-bottom: 1px ${({theme})=>theme.palette.background.line} solid;
  margin-bottom:10px;
  padding-bottom:10px;
`;

export const TableRowComponent = withStyles((theme) => ({
    root: {
        '&:hover' : {backgroundColor:theme.palette.background.hoverPaperLighter}
    },
}))((props) => <TableRow {...props} />);


export const InputEmail = withStyles((theme) => ({
    root: {
        border: `1px ${theme.palette.background.line} solid`,
        color: theme.palette.text.contrastWhite,
        marginBottom:10,
    },
}))((props) => <TextField {...props} />);

