import React, { Fragment } from 'react';
import {Icons} from '../../../Icons/iconsDashboard'
import { darken, fade } from "@material-ui/core/styles";
import styled, {css} from "styled-components";

export const Button = styled.div`
  border-radius: 50px;
  background: ${({theme})=>theme.palette.primary.main};
  white-space: nowrap;
  padding: 6px 18px;
  color: ${({theme})=>theme.palette.primary.contrastText};
  font-weight:bold;
  font-size: 14px;
  outline: none;
  border: none;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.12);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(0.95);
  }
`;

const Checkboxes = ({text='Novo Horário',iconName='Add',iconProps,textProps,...props}) => {

  return(
    <Button {...props}>
      <Icons  style={{fontSize:26,marginRight:8,marginLeft:-7}} type={iconName} {...iconProps}/>
      <p {...textProps}>{text}</p>
    </Button>
  );
}

export default Checkboxes;
