import React from 'react';
import styled, {ThemeContext} from "styled-components";
import {ContinueButton} from '../../../Main/MuiHelpers/Button'
import { Form } from "@unform/web";
import CircularProgress from '@material-ui/core/CircularProgress';

export const FormContainer = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  color: ${({theme})=> theme.palette.text.primary};
  gap:20px;
`;

export const HeaderForm = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-bottom:10px;
`;

export const TitleForm = styled.h1`
    text-align:start;
    width:100%;
    font-size:25px;
    color: ${({theme})=> theme.palette.text.primary };
    margin-bottom:10px;
`;

export const SubTitleForm = styled.p`
    text-align:start;
    font-size:16px;
    color: ${({theme})=> theme.palette.text.primary };
`;

export const DividerForm = styled.h3`
  width: 100%;
  margin-top:30px;
  margin-bottom:10px;
  color: ${({theme})=>theme.palette.text.third};
`;

export const AddAnotherForm = styled.div`
    max-width:fit-content;
    padding:7px 10px;
    margin-left:auto;
    border-radius: 5px;
    margin-top:10px;
    margin-bottom:-30px;
    font-size:13px;
    color: ${({theme})=> theme.palette.text.secondary };
    border-color: ${({theme})=> theme.palette.text.third };
    border-width: 1px;
    border-style: solid;
    cursor:pointer;

    &:hover {
        border-color: ${({theme})=> theme.palette.primary.main };
    }
    &:active {
      opacity:0.6;
    }
`;

const Button = styled(ContinueButton)`
`;

export function ButtonForm({children,loading,justify='flex-end',mt=10,...props}) {
  const theme = React.useContext(ThemeContext)

  return(
    <div style={{display:'flex',width:'100%',justifyContent:justify,marginTop:mt}} >
      <div style={{position: 'relative'}}>
        <Button disable={String(loading)} style={{width:200}} {...props} >{children}</Button>
        {loading && <CircularProgress size={24} style={{color: theme.palette.primary.main,position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}} />}
      </div>
    </div>
  )
}
