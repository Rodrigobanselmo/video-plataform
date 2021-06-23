import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {ModalMui} from '../MuiHelpers/Modal'
import {CancelButton,ContinueButton} from '../MuiHelpers/Button'
import styled from "styled-components";

const DivC = styled.div`
  min-width: 400px;
  max-width: 450px;
  margin-top: 10px;

  @media screen and (max-width: 500px) {
    min-width: 300px;
  }
`;


const DivComp = styled.div`
  min-width: 400px;
  max-width: 90vw;
  margin-top: 10px;

  @media screen and (max-width: 500px) {
    min-width: 300px;
  }

`;


const Text = styled.p`
  font-size: 1.05em;
  line-height:1.6;
  color: ${props=>props.theme.palette.text.primary};
`;

export function ModalInfo({
            open,
            onClose,
            onClick,
            buttonDirection,
            rightBnt,
            leftBnt,
            title,
            text,
            type,
            component:Component,
        })
    {


  function onCloseModal() {
    if (onClose) onClose()
  }

  function onAction(event) {
    event && event?.preventDefault && event.preventDefault();
    if (onClick) onClick()
    onCloseModal()
  }

  return (
    <ModalMui open={open} onClose={onCloseModal} title={title}>
        {Component?
          <DivComp >
            {text && <Text >{text}</Text>}
            <Component/>
          </DivComp>
        :
        <DivC >
            <Text >{text}</Text>
        </DivC>
        }
        <div style={{marginTop:27,flexDirection: buttonDirection === 'normal' ? 'row':'row-reverse',display:'flex', alignItems: 'center', justifyContent: buttonDirection === 'normal' ? 'flex-end':'flex-start',width:'100%'}}>
            {type === 'inform' ?
              <ContinueButton primary={'true'} onClick={onAction} minwidth={'120px'} >{rightBnt}</ContinueButton>
            :
              <>
                <CancelButton onClick={onClose} style={{  marginRight:buttonDirection === 'normal'?'15px':0}} variant="outlined" >{leftBnt}</CancelButton>
                <ContinueButton onClick={onAction} style={{  marginRight:buttonDirection === 'normal'?'0px':'15px'}} >{rightBnt}</ContinueButton>
              </>
           }
        </div>
    </ModalMui>
  );
}
