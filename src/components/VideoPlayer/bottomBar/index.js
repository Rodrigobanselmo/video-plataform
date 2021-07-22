import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useNotification} from '../../../context/NotificationContext'
import {TextSlider,SliderInside,SliderButton,NextIcon,FullIcon,PreviousIcon,BoxIcon,BottomBar} from './style'
// import {DASHBOARD,ADMIN_PERFIL} from '../../../routes/routesNames'
import { useParams,useHistory } from 'react-router-dom';



export function BottomControls({autoplay,setAutoplay,handleNextVideo,handlePreviewVideo}) {
  return (
    <BottomBar >
      <SliderButton onClick={()=>setAutoplay(!autoplay)} autoplay={autoplay}>
        <SliderInside autoplay={autoplay}/>
      </SliderButton>
      <TextSlider>Autoplay</TextSlider>
      <BoxIcon onClick={handlePreviewVideo} style={{marginLeft:'auto'}}>
        <PreviousIcon style={{fontSize:24}} />
        <span style={{color:'#fff',fontWeight:'bold'}}>Anterior</span>
      </BoxIcon>
      <BoxIcon onClick={handleNextVideo}>
        <span style={{color:'#fff',fontWeight:'bold'}}>Próximo</span>
        <NextIcon style={{fontSize:24}} />
      </BoxIcon>
      <BoxIcon style={{marginRight:'0px',width:'40px'}}>
        <FullIcon style={{fontSize:24}} />
      </BoxIcon>
    </BottomBar>
  )
}
