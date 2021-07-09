import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import {NormalizeData} from '../../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled, {css} from "styled-components";
import { Collapse } from '@material-ui/core';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { VideoPlayer } from '../../../../components/VideoPlayer';
import { SideVideoBar } from '../../../../components/VideoPlayer/sidebar';
import {Title,ContainerPlayer,SideVideoBarTry,ProgressContainer,PercentageSpan,Shadow,ProgressWrapper,CircleView,ProgressBar} from './style'
import { CreateCursoData,GetCursoDataValidatePage,UpdateStudentProgress } from '../../../../services/firestoreVideo'
import {useAuth} from '../../../../context/AuthContext'
import { useHistory,useParams,useLocation } from "react-router-dom"

import { useSelector,useDispatch } from 'react-redux'


const modulesAll = {
  id:'dyuwqf2',
  professionals:[{name:"Alex Abreu",id:'123213'},{name:"Carla Muller",id:'qw7e62'}],
  name:'EPI',
  modules:[
  {
    name:'Introdução',
    id:'1254636125',
    classes:[
      {private:false,name:'Abertura?',id:'1',video:'https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/Parte-01-Vi%CC%81deo-0001%20(0001-0003)-G.m4v?alt=media&token=d1a3d63b-4a85-4dd5-b0c2-24e88ddd6e65'},
      {private:false,name:'O que é médicina e segurança do trabalho?',id:'2',video:'https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/Parte-01-Vi%CC%81deo-0002%20(0004-0007)-G.m4v?alt=media&token=8cbc889d-c4bf-4c8c-bb01-5dbd5cab49e4'},
      {private:false,name:'Responsaveis por organizar o curso',id:'3',lock:['order']},
      {private:false,name:'Por que esse curso?',id:'4',lock:['order']},
      {private:false,name:'Professores que estarão presentes',id:'5',lock:['order']},
    ]
  },
  {
    name:'Equipe tecnica responsavel',
    id:'ewrew324',
    classes:[
      {private:true,lock:['order'],name:'Quem são seus mentores',id:'6'},
      {private:true,lock:['order'],name:'O que você vai aprender',id:'7'},
      {private:true,lock:['order'],name:'Requisitos',id:'8'},
      {private:true,lock:['order'],name:'Todas as normas que você poderá encontrar em um trabalho home ofice',id:'9'},
      {private:true,lock:['order'],name:'Professores que estarão presentes',id:'q'},
    ]
  },
  {
    name:'Professores',
    id:'xxwerweafes',
    classes:[
      {private:true,lock:['order'],name:'Quem são seus mentores',id:'w'},
      {private:true,lock:['order'],name:'O que você vai aprender',id:'e'},
      {private:true,lock:['order'],name:'Requisitos',id:'r'},
      {private:true,lock:['order'],name:'Todas as normas que você poderá encontrar em um trabalho home ofice',id:'t'},
      {private:true,lock:['order'],name:'Professores que estarão presentes',id:'y'},
    ]
  },
]}

export default function Video() {

  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const {currentUser} = useAuth();
  const modules = useSelector(state => state.modules)
  const history = useHistory()
  const dispatch = useDispatch()
  // const { pathname } = useLocation();


  let { moduleId,classId,cursoId } = useParams();
  const [curso, setCurso] = useState(false)

  const pathname = '/app/admin/video/'+cursoId

  const data = {
    curso:'EPI',
    percentage:'0',
    id:'dyuwqf2',
    buyDate:new Date() * 1,
    startDate:new Date() * 1,
    endDate:null,
    numOfClasses:15,
    watched:{},
    modules:'all',
    classes:'all',
    position:'0/0'
    // '1254636125': {
    //   '1':'0'
    // }
  }

  function onError(error) {
    notification.error({message:error})
    setLoaderDash(false)
  }

  function onSetRouteVideo(data,curso) {
    if (data?.nextModule) {
      history.replace(pathname+'/'+data.nextModule+'/'+data.nextClass)
    } else {
      history.replace(pathname+'/'+curso.modules[0].id+'/'+curso.modules[0].classes[0].id)
    }

  }

  function onSuccessGetCurso(data,userData) {
    if (Array.isArray(userData)) {
      history.replace(pathname+'/'+userData[0].moduleId+'/'+userData[0].aulaId)
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
    console.log(1)
    // CreateCursoData(modulesAll,()=>notification.success({message:'Curso criado com sucesso'}),(e)=>notification.error({message:e}))
    // UpdateStudentProgress(modules,currentUser,()=>{},()=>{})
    GetCursoDataValidatePage(cursoId,currentUser,onSuccessGetCurso,onError)
    setLoaderDash(true)
  }, [cursoId])

  useEffect(() => {
    if (curso) {
      console.log('moduleUpdate')
      UpdateStudentProgress(modules,currentUser,()=>{},onError)
    }
  }, [modules])

  // useEffect(() => {
  //   console.log(2)
  // }, [moduleId,classId])


  // function onGetUser({setClients,notification,setLoaderDash}) {
  //   function checkSuccess(response) {
  //     setClients([...response])
  //     setLoaderDash(false)
  //   }

  //   function checkError(error) {
  //     setTimeout(() => {
  //       notification.error({message:error})
  //     }, 600);
  //     setLoaderDash(false)
  //   }

  //   setLoaderDash(true)
  //   GetAllDataTwoFilters('client',['conector', false],checkSuccess,checkError)
  // }

  return (
    <>
      {curso?
        <Shadow >
          <Title >EPI: Luva Protetora</Title>
          <ProgressContainer >
            <ProgressWrapper >
              <ProgressBar style={{width:`${modules.percentage*100}%`}}/>
            </ProgressWrapper>
            <PercentageSpan >{Math.round(modules.percentage*100)}%</PercentageSpan>
          </ProgressContainer>
          <ContainerPlayer >

            <VideoPlayer curso={curso} notification={notification} />

            <SideVideoBarTry>
              <SideVideoBar curso={curso}/>
            </SideVideoBarTry>

          </ContainerPlayer>
        </Shadow>
      :null}
    </>
  );
}



//https://www.codingdeft.com/posts/react-upload-file-progress-bar/
//https://quantizd.com/building-a-video-converter-app-with-node-js-express-and-react/
{/* <Logo  height="400px" width="400px"/> */}

//https://realizaconsultoria.netlify.app/login?email=carla@realizaconsultoria.com.br
//carla@realizaconsultoria.com.br
