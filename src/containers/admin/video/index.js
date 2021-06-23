import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled from "styled-components";

import axios from 'axios';
import { saveAs } from 'file-saver';
import { VideoPlayer } from '../../../components/VideoPlayer';

const CardClient = styled.div`
    background-color: red;
    min-height:40px;
    width:100%;
    overflow-y:auto;
    padding: 8px 10px;
    border-radius:5px;
    background-color: ${({theme})=>theme.palette.primary.mainPurple};
    -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.23);
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.23);

    & .name {
      font-size:16px;
      font-family: sans-serif , Arial;
      margin:0px;
      padding:0px;
      margin-bottom:3px;
    }

    & .plan {
      font-size:12px;
      font-family: sans-serif , Arial;
      padding:0px;
      margin:0px;
    }

    & .planStart {
      font-size:10px;
      display:inline-block;
      font-family: sans-serif , Arial;
      margin:0px;
      padding:0px;
    }

    &:hover {
        opacity:0.8;
    }
    &:active {
      opacity:0.9;
    }

`;


const ContainerRight = styled.div`
  display: flex;
  flex: 1;
  background-color: ${({theme})=>theme.palette.background.paper};
  -webkit-box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.23);
  border-radius:10px;
  padding: 10px 0px;
  flex-direction:column;
  overflow-x:visible;

  p {
   font-size:18px;
   font-family: sans-serif , Arial;
   margin: 0px 20px;
   margin-bottom:10px;
  }

  & .scrollView {
    height:100%;
    padding: 5px 20px;
    width:100%;
    overflow-y:auto;
    overflow-x:visible;
  }


`;


export default function Video() {

  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();

  useEffect(() => {
    setLoaderDash(false)
  }, [])


  return (
    <div style={{display:'flex',flexDirection:'row',flex:1,height:'88%'}}>
      <VideoPlayer/>
    </div>
  );
}


//https://www.codingdeft.com/posts/react-upload-file-progress-bar/
//https://quantizd.com/building-a-video-converter-app-with-node-js-express-and-react/
{/* <Logo  height="400px" width="400px"/> */}
