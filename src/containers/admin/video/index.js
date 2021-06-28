import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled, {css} from "styled-components";
import { Collapse } from '@material-ui/core';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { SideVideoBar } from '../../../components/VideoPlayer/sidebar';
import {Container} from './style'
import { useParams } from 'react-router-dom';
import { CreateCursoData,GetCursoDataValidatePage,UpdateStudentProgress } from '../../../services/firestoreVideo'
import {useAuth} from '../../../context/AuthContext'
import { useHistory,useLocation } from "react-router-dom"

import { useSelector,useDispatch } from 'react-redux'

const GradientView = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  /* background-image: linear-gradient(to top, #202026, transparent); */
  background-image: linear-gradient(to bottom right, #d2d5d5, #bdbec3);
`;


const CursoCard = styled.div`
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.29);
  position: relative;
  display: flex;
  width: fit-content;
  overflow: hidden;
  flex-direction: column;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    img {
      transform: scale(1.05);
    }
  }

`;



export default function Video() {

  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const {currentUser} = useAuth();
  const modules = useSelector(state => state.modules)
  const history = useHistory()
  const dispatch = useDispatch()
  // const { pathname } = useLocation();



  const pathname = '/app/admin/video'

  function onError(error) {
    notification.error({message:error})
    setLoaderDash(false)
  }

  function onSetRouteVideo(data,curso) {
    if (data?.nextModule) {
      history.push(pathname+'/'+data.nextModule+'/'+data.nextClass)
    } else {
      history.push(pathname+'/'+curso.modules[0].id+'/'+curso.modules[0].classes[0].id)
    }

  }

  function onSuccessGetCurso(data,userData) {
    if (Array.isArray(userData)) {
      history.push(pathname+'/'+userData[0].moduleId+'/'+userData[0].aulaId)
    } else {
      updateModules(userData,data)
      setCurso(data)
      setLoaderDash(false)
    }
  }

  function updateModules(userData,curso) {
    // // console.log('update',userData)
    // dispatch({ type: 'MODULE_WRITE', payload: data })
    // dispatch({ type: 'PROGRESS_LOGOUT', payload: data })
    // UpdateStudentProgress(data,currentUser,()=>{},onError)

    if (('percentage' in modules && modules.percentage < userData.percentage) || !('percentage' in modules)) {
      dispatch({ type: 'MODULE_WRITE', payload: userData })
      onSetRouteVideo(userData,curso)
      console.log('update modules')
    } else if (modules?.percentage && modules.percentage > userData.percentage) {
      onSetRouteVideo(modules,curso)
      UpdateStudentProgress(modules,currentUser,()=>{},onError)
      console.log('update student')
    } else {
      onSetRouteVideo(modules,curso)
    }
  }

  useEffect(() => {
    // CreateCursoData(modulesAll,()=>notification.success({message:'Curso criado com sucesso'}),(e)=>notification.error({message:e}))
    // UpdateStudentProgress(modules,currentUser,()=>{},()=>{})
    // GetCursoDataValidatePage(cursoId,currentUser,onSuccessGetCurso,onError)
    setLoaderDash(false)
  }, [])

  return (
    <Container >
      <h1 style={{marginBottom:10}}>Seus cursos</h1>
      <CursoCard onClick={()=>{}} >
        <GradientView />
        <img width={320} height={200} style={{resizeMode:'cover'}} src='https://prometalepis.com.br/wp-content/uploads/2019/08/5d62c7fc90649bc6d856ef7ff9a174bd.jpg' />
        <div style={{display:'flex',backgroundColor:'#202026',width:'320px',padding:'0 15px 10px 15px',height:'fit-content',flexDirection:'column',top:150,left:20}}>
          <p style={{fontWeight:'bold',fontSize:'27px',color:'#eee',marginTop:-30,zIndex:10}} >NR 17 - Ergonomia - Teleatendimento </p>
        </div>
      </CursoCard>
    </Container>
  );
}



//https://www.codingdeft.com/posts/react-upload-file-progress-bar/
//https://quantizd.com/building-a-video-converter-app-with-node-js-express-and-react/
{/* <Logo  height="400px" width="400px"/> */}
