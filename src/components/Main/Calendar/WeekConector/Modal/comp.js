import React, {useState,useRef} from 'react';
import {Icons} from '../../../../Icons/iconsDashboard';
import {ModalMui, ModalFullScreen} from '../../../MuiHelpers/Modal'
import {HeaderPage,Page,MainTitle,Container,InputsContainer,Title,SubTitle,IconCloseFull,IconGoBackFull} from '../../../../Dashboard/Components/Standard/PageCarousel'

export function AddModal({children, ...restProps }) {
    return (
        <ModalFullScreen {...restProps}>
          <Container style={{padding:0}}>
            {children}
          </Container>
        </ModalFullScreen>
    );
}

