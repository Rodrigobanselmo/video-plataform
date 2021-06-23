import React from 'react';
import {ModalMui} from '../MuiHelpers/Modal'
import {CancelButton,ContinueButton} from '../MuiHelpers/Button'

export function ModalButtons({
            open,
            onClose,
            onCancel,
            onClick,
            buttonDirection='normal',
            rightBnt='Confirmar',
            leftBnt='Cancelar',
            title='Modal',
            disable=false,
            children,
            onContextMenu,
            padding,
            dontCloseOnConfirm,
            extraBnt,
            extraOnClick
        })
    {


  function onCloseModal() {
    if (onClose) onClose()
    if (onCancel) onCancel()
  }

  function onAction(event) {
    event && event?.preventDefault && event.preventDefault();
    if (onClick) onClick()
    if (onClose && !dontCloseOnConfirm) onClose()
  }

  function onExtra(event) {
    event && event?.preventDefault && event.preventDefault();
    if (extraOnClick) extraOnClick()
    if (onClose && !dontCloseOnConfirm) onClose()
  }

  return (
    <ModalMui open={open} padding={padding} onClose={onCloseModal} title={title}>
      <div style={{maxHeight:'80vh',overflow:'auto'}}>
        <div style={{minWidth:'300px',marginTop:'10px'}}>
            {children}
        </div>
        <div style={{marginTop:27,flexDirection: buttonDirection === 'normal' ? 'row':'row-reverse',display:'flex', alignItems: 'center', justifyContent: buttonDirection === 'normal' ? 'flex-end':'flex-start',width:'100%'}}>
          {extraBnt && <ContinueButton  onClick={onExtra} style={{  marginRight:'auto'}} >{extraBnt}</ContinueButton>}
          <CancelButton  onClick={onCloseModal} style={{  marginRight:buttonDirection === 'normal'?'15px':0}} variant="outlined" >{leftBnt}</CancelButton>
          <ContinueButton disable={`${disable}`} primary={'true'} onClick={onAction} style={{  marginRight:buttonDirection === 'normal'?'0px':'15px'}} >{rightBnt}</ContinueButton>
        </div>
      </div>
    </ModalMui>
  );
}
