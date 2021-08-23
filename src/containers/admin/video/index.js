import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled, {css} from "styled-components";
import Collapse from '@material-ui/core/Collapse';
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

const NameText = styled.p`
  font-weight: bold;
  font-size: 27px;
  color: #eee;
  z-index: 10;

  overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
   -webkit-box-orient: vertical;
`;


const BottomView = styled.div`
  display: flex;
  flex:1;
  z-index: 2;
  background-color: #202026;
  justify-content:flex-end;
  width: 320px;
  padding: 0 15px 15px 15px;
  height: fit-content;
  flex-direction: column;

  P {
    /* transition: transform 0.5s ease; */
  }
`;


const Image = styled.img`
  resize-mode: cover;
  transition: transform 0.5s ease;
`;


const GradientView = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  background-image: linear-gradient(to top, #202026, transparent);
  z-index:1;
  /* transition: background-image 0.5s ease; */
`;


const CursoCard = styled.div`
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.29);
  position: relative;
  display: flex;
  flex:1;
  width: fit-content;
  overflow: hidden;
  flex-direction: column;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    & ${Image} {
      z-index:0;
      transform: scale(1.1);
    }
    /* & ${GradientView} { */
      /* background-image: linear-gradient(to top,  #202026, transparent); */
    /* } */

    /* & ${BottomView} {
      p {
        transform: scale(1.03) translateX(2px);
      }
    } */
    /* opacity:1; */
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

  // function onError(error) {
  //   notification.error({message:error})
  //   setLoaderDash(false)
  // }

  // function onSetRouteVideo(data,curso) {
  //   if (data?.nextModule) {
  //     history.replace(pathname+'/'+data.nextModule+'/'+data.nextClass)
  //   } else {
  //     history.replace(pathname+'/'+curso.modules[0].id+'/'+curso.modules[0].classes[0].id)
  //   }

  // }

  // function onSuccessGetCurso(data,userData) {
  //   if (Array.isArray(userData)) {
  //     history.replace(pathname+'/'+userData[0].moduleId+'/'+userData[0].aulaId)
  //   } else {
  //     updateModules(userData,data)
  //     setCurso(data)
  //     setLoaderDash(false)
  //   }
  // }

  // function updateModules(userData,curso) {
  //   // // console.log('update',userData)
  //   // dispatch({ type: 'MODULE_WRITE', payload: data })
  //   // dispatch({ type: 'PROGRESS_LOGOUT', payload: data })
  //   // UpdateStudentProgress(data,currentUser,()=>{},onError)

  //   if (('percentage' in modules && modules.percentage < userData.percentage) || !('percentage' in modules)) {
  //     // dispatch({ type: 'MODULE_WRITE', payload: userData })
  //     onSetRouteVideo(userData,curso)
  //     console.log('update modules')
  //   } else if (modules?.percentage && modules.percentage > userData.percentage) {
  //     onSetRouteVideo(modules,curso)
  //     UpdateStudentProgress(modules,currentUser,()=>{},onError)
  //     console.log('update student')
  //   } else {
  //     onSetRouteVideo(modules,curso)
  //   }
  // }

  useEffect(() => {
    // CreateCursoData(modulesAll,()=>notification.success({message:'Curso criado com sucesso'}),(e)=>notification.error({message:e}))
    // UpdateStudentProgress(modules,currentUser,()=>{},()=>{})
    // GetCursoDataValidatePage(cursoId,currentUser,onSuccessGetCurso,onError)
    setLoaderDash(false)
  }, [])

  const createAndDownloadPdf = () => {
    console.log(0)
    axios({
      method:'post',
      url:'http://localhost:3333/pdf',
      responseType: 'blob',
      data:{
        name: 'Rodrigo Barbosa Anselmo',
        cpf:'401.951.858-03',
        date:'26 de agosto de 2021',
        cursoName:'Curso de EPI (NR 1)',
      }
    }).then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      console.log(1)
      saveAs(pdfBlob, 'newPdf.pdf');
    }).catch(async error=>{
      const errorString = JSON.parse(await error.response.data.text());
      console.log(errorString.message)
    })
  }



  {/* <Logo  height="400px" width="400px"/> */}


  return (
    <Container >
          <button onClick={createAndDownloadPdf}>Download PDFs</button>
      {/* <h1 style={{marginBottom:10}}>Home</h1> */}
      {/* <div style={{display:'flex',flexDirection:'row',gap:30}}>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          <CursoCard onClick={()=>history.push(pathname+'/dyuwqf2')} >
            <GradientView />
            <Image width={320} height={200}  src='https://prometalepis.com.br/wp-content/uploads/2019/08/5d62c7fc90649bc6d856ef7ff9a174bd.jpg' />
            <BottomView >
              <NameText  >NR 17 - Ergonomia - Teleatendimento do trabalho</NameText>
            </BottomView>
          </CursoCard>
          <p style={{fontSize:'14px',color:'#000',zIndex:10,textAlign:'right',padding:5,paddingRight:0}} >Em andamento com validade até 22/02</p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          <CursoCard onClick={()=>history.push(pathname+'/dyuwqf2')} >
            <GradientView />
            <Image width={320} height={200}  src='https://prometalepis.com.br/wp-content/uploads/2019/08/5d62c7fc90649bc6d856ef7ff9a174bd.jpg' />
            <BottomView >
              <NameText style={{fontWeight:'bold',fontSize:'27px',color:'#eee',marginTop:-40,zIndex:10}} >NR 17 - Ergonomia</NameText>
            </BottomView>
          </CursoCard>
          <p style={{fontSize:'14px',color:'#000',zIndex:10,textAlign:'right',padding:5,paddingRight:0}} >Em andamento com validade até 22/02</p>
        </div>

      </div> */}
    </Container>
  );
}



//https://www.codingdeft.com/posts/react-upload-file-progress-bar/
//https://quantizd.com/building-a-video-converter-app-with-node-js-express-and-react/
{/* <Logo  height="400px" width="400px"/> */}
