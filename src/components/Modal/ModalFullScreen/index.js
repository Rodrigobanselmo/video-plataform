import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styled, {css} from "styled-components";
import IconButton from '@material-ui/core/IconButton';
import {Icons} from '../../Icons/iconsDashboard'
import {useNotification} from '../../../context/NotificationContext'

const FullModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props=>props.transparent?'#000000bb':props.theme.palette.background.default};
  position:relative;
  z-index:1111110;
  width:100%;
  height:100%;
  overflow-y:scroll;
  overflow-x:hidden;
`;


const IconCloseButton = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 25px;
  padding:7px;
  border-radius:4px;
  max-width:100px;

  ${props => props.padding && css`
      top: 10px;
  `}

`;

const IconCloseFull = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 30px;
  padding:7px;
  border-radius:4px;
  z-index:111441110;

  @media screen and (max-width: 700px) {
    top: 10px;
    right: 10px;
  }
  @media screen and (max-width: 1000px) {
    top: 20px;
    right: 20px;
  }
`;

const Icon = styled(Icons)`
  font-size: 30px;
  border-radius:4px;
  color: ${props=>props.transparent?'#eee':props.theme.palette.text.primary};
  cursor: pointer;

  &:hover {
    /* color:${({theme})=>theme.palette.text.secondary}; */
  color: ${props=>props.transparent?'#fff':props.theme.palette.text.secondary};
  }

  &:active {
    /* color:${({theme})=>theme.palette.text.third}; */
  color: ${props=>props.transparent?'#eff':props.theme.palette.text.third};
  }

`;

const IconGoBackFull = styled(IconCloseButton)`
  top: 30px;
  left: 30px;
  font-size: 30px;
  max-width:100px;
  z-index:111441110;

  @media screen and (max-width: 700px) {
    top: 10px;
    left: 10px;
  }
  @media screen and (max-width: 1000px) {
    top: 20px;
    left: 20px;
  }
`;

export function ModalFullScreen({children,open,transparent,onClose,infoModal=false,onGoBack=false,arrow=false}) {

    const notification = useNotification();


    function onCloseInfoModalAndFullScreen() {
        notification.modalReset({})
        onClose()
    }

    function onCloseModal() {
      if (infoModal && infoModal?.title) {
        notification.modal({title: infoModal.title,text:infoModal.text,rightBnt:'Fechar',open:true,onClick:onCloseInfoModalAndFullScreen})
      } else {
        onClose()
      }
    }

    return (
        <Modal
          style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}
          open={open}
          onClose={onCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>

            <FullModalContainer transparent={transparent} >
              <IconCloseFull >
                  <IconButton onClick={onCloseModal} aria-label="close">
                      <Icon transparent={transparent} type={'Close'} />
                  </IconButton>
              </IconCloseFull>
              {onGoBack && arrow?
                <IconGoBackFull >
                    <IconButton onClick={onGoBack} aria-label="goBack">
                        <Icon transparent={transparent}  type={'ArrowBack'} />
                    </IconButton>
                </IconGoBackFull>
              : null}
              {children}
            </FullModalContainer>
          </Fade>
        </Modal>
    );
  }
