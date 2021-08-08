import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled, {css} from "styled-components";
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { SideVideoBar } from '../../../components/VideoPlayer/sidebar';
import {Title,ContainerPlayer,SideVideoBarTry,ProgressContainer, Container,PercentageSpan,Shadow,ProgressWrapper,CircleView,ProgressBar} from './style'
import { CreateCursoData,GetCursoDataValidatePage,UpdateStudentProgress } from '../../../services/firestoreVideo'
import {useAuth} from '../../../context/AuthContext'
import { useHistory,useParams,useLocation } from "react-router-dom"

import { useSelector,useDispatch } from 'react-redux'
import { CURSOS, VIDEO_ROUTE } from '../../../routes/routesNames';
import { useCurso } from '../../../services/hooks/get/useCurso';
import { useUpdateCurso } from '../../../services/hooks/set/useUpdateCurso';
import { useStudent } from '../../../services/hooks/get/useStudent';
import { queryClient } from '../../../services/queryClient';





const modulesAll = {
  id:'dyuwqf2',
  professionals:[{name:"Alex Abreu",id:'123213'},{name:"Carla Muller",id:'qw7e62'}],
  name:'EPI',
  numOfClasses:10,
  numOfModules:3,
  name:'EPI',
  name:'EPI',
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

 // const data = {
  //   curso:'EPI',
  //   percentage:'0',
  //   id:'dyuwqf2',
  //   buyDate:new Date() * 1,
  //   startDate:new Date() * 1,
  //   endDate:null,
  //   numOfClasses:15,
  //   watched:{},
  //   modules:'all',
  //   classes:'all',
  //   position:'0/0'
  //   // '1254636125': {
  //   //   '1':'0'
  //   // }
  // }

export default function Video() {

  const {currentUser} = useAuth();
  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const { cursoId } = useParams();

  // const  { data:curso, isLoading:cursoIsLoading } = useCurso({cursoId})
  const  { data, isLoading } = useStudent({cursoId})

  const cursoPrev = data?.curso
  let curso = {...cursoPrev}


  useEffect(() => {
    if (cursoPrev) curso.modules[0].classes.push({
      id:'091283',
      lock:['order'],
      name:'Teste',
      questions: [
        {
          text:'Normalmente, quantos litros de sangue uma pessoa tem? Em média, quantos são retirados numa doação de sangue?',
          id:Math.random().toString(36),
          options:[
            {text:'Tem entre 2 a 4 litros. São retirados 450 mililitros'},
            {text:'Tem entre 4 a 6 litros. São retirados 450 mililitros'},
            {text:'Tem 10 litros. São retirados 2 litros'},
            {text:'Tem 7 litros. São retirados 1,5 litros'},
            {text:'Tem 0,5 litros. São retirados 0,5 litros'},
          ],
          answer:'Tem entre 4 a 6 litros. São retirados 450 mililitros',
          why:'A quantidade de sangue varia de pessoa para pessoa. O volume de sangue é entre 7% e 8% o peso corporal. Assim, um adulto com 50 e 80 quilos, pode ter entre 4 e 6 litros de sangue, respectivamente.',
        },
        {
          text:'De quem é a famosa frase “Penso, logo existo”?',
          id:Math.random().toString(36),
          options:[
            {text:'Platão'},
            {text:'Galileu Galilei'},
            {text:'Descartes'},
            {text:'Sócrates'},
            {text:'Francis'},
          ],
          answer:'Descartes'
        },
        // {
        //   text:' De onde é a invenção do chuveiro elétrico?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'França'},
        //     {text:'Inglaterra'},
        //     {text:'Brasil'},
        //     {text:'Austrália'},
        //     {text:'Itália'},
        //   ],
        //   answer:'Brasil',
        // },
        // {
        //   text:'Normalmente, quantos litros de sangue uma pessoa tem? Em média, quantos são retirados numa doação de sangue?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'Tem entre 2 a 4 litros. São retirados 450 mililitros'},
        //     {text:'Tem entre 4 a 6 litros. São retirados 450 mililitros'},
        //     {text:'Tem 10 litros. São retirados 2 litros'},
        //     {text:'Tem 7 litros. São retirados 1,5 litros'},
        //     {text:'Tem 0,5 litros. São retirados 0,5 litros'},
        //   ],
        //   answer:Tem entre 4 a 6 litros. São retirados 450 mililitros',
        // },
        // {
        //   text:'De quem é a famosa frase “Penso, logo existo”?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'Platão'},
        //     {text:'Galileu Galilei'},
        //     {text:'Descartes'},
        //     {text:'Sócrates'},
        //     {text:'Francis'},
        //   ],
        //   answer:['Descartes',2]
        // },
        // {
        //   text:' De onde é a invenção do chuveiro elétrico?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'França Bandeira insígnia da presidência, bandeira nacional, brasão, hinos e selo Bandeira insígnia da presidência, bandeira nacional, brasão, hinos e selo Bandeira insígnia da presidência, bandeira nacional, brasão, hinos e selo'},
        //     {text:'Inglaterra'},
        //     {text:'Brasil'},
        //     {text:'Austrália'},
        //     {text:'Itália'},
        //   ],
        //   answer:['Brasil',2]
        // },
        // {
        //   text:'Normalmente, quantos litros de sangue uma pessoa tem? Em média, quantos são retirados numa doação de sangue?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'Tem entre 2 a 4 litros. São retirados 450 mililitros'},
        //     {text:'Tem entre 4 a 6 litros. São retirados 450 mililitros'},
        //     {text:'Tem 10 litros. São retirados 2 litros'},
        //     {text:'Tem 7 litros. São retirados 1,5 litros'},
        //     {text:'Tem 0,5 litros. São retirados 0,5 litros'},
        //   ],
        //   answer:['Tem entre 4 a 6 litros. São retirados 450 mililitros',1]
        // },
        // {
        //   text:'De quem é a famosa frase “Penso, logo existo”?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'Platão'},
        //     {text:'Galileu Galilei'},
        //     {text:'Descartes'},
        //     {text:'Sócrates'},
        //     {text:'Francis'},
        //   ],
        //   answer:['Descartes',2]
        // },
        // {
        //   text:' De onde é a invenção do chuveiro elétrico?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'França'},
        //     {text:'Inglaterra'},
        //     {text:'Brasil'},
        //     {text:'Austrália'},
        //     {text:'Itália'},
        //   ],
        //   answer:['Brasil',2]
        // },
        // {
        //   text:' De onde é a invenção do chuveiro elétrico?',
        //   id:Math.random().toString(36),
        //   options:[
        //     {text:'França'},
        //     {text:'Inglaterra'},
        //     {text:'Brasil'},
        //     {text:'Austrália'},
        //     {text:'Itália'},
        //   ],
        //   answer:['Brasil',2]
        // },
      ],
      numQuestions:2,
      numToPass:1,
      maxTime:30,
      private:true,
      type:'test'
    })
  }, [data])



  const student = data?.student

  const uploadCursoMutation = useUpdateCurso(cursoId)

  const module = useSelector(state => state.modules)
  const modules = student?student[0]:{}
  const history = useHistory()

  const pathname = VIDEO_ROUTE + '/' +cursoId


  function onSetRouteVideo(studentData,cursoData) {
    if (studentData?.nextModule) {
      history.replace(pathname+'/'+studentData.nextModule+'/'+studentData.nextClass)
    } else {
      history.replace(pathname+'/'+cursoData.modules[0].id+'/'+cursoData.modules[0].classes[0].id)
    }
  }

  async function updateModules(cursoData,studentData) { //serve para ver qual estado (persisted ou database) esta mais atual
    console.log('modulemodule',module)
    //observa por mudanças nos epis durante o curso
    const watchCursos = currentUser?.cursos ?? []
    const index = watchCursos.findIndex((i) => i.id === cursoId && i?.status === 'started' && i?.epi);

    // se curso existir e tiver em progresso verfico se numero/ids de epis é o mesmo
    if (index >= 0) {
      const epiArray = []
      const isEqualEpis = watchCursos[index].epi.map(epi=>{
        epiArray.push(epi.id)
        return studentData.classes.includes(epi.id)
      }).filter(i=>!i).length == 0
      if (!isEqualEpis) {
        const newStudent = {...studentData}
        newStudent.numOfClasses = newStudent.numOfClasses + epiArray.length - newStudent.classes.length
        newStudent.classes = epiArray
        await uploadCursoMutation.mutateAsync(newStudent)
      }
    }

    if (module && module[studentData.id] && module[studentData.id]?.totalWatched && module[studentData.id].totalWatched > studentData.totalWatched) {
      onSetRouteVideo(module,cursoData)
      await uploadCursoMutation.mutateAsync(module[studentData.id])
      console.log('update student') // remove
    } else {
      onSetRouteVideo(studentData,cursoData)
    }
  }

  useEffect(() => {

    console.log('modules',modules)
    const isLoadFinished = !isLoading
    const isStudent = curso && student && student.length > 0

    if (isLoadFinished && isStudent) {
      updateModules(curso,student[0]) //se tiver tudo certo manda pra cá
      setLoaderDash(false)
    }

    if (isLoadFinished && !isStudent) {
      notification.error({message:'É necesário que você esteja cadastrado neste curso para continuar!'})
      return history.push(CURSOS)
    }

}, [isLoading])

  return (
    <Container>
      {(curso && student && student[0] && !isLoading)?
        <Shadow >
          <Title >EPI</Title>
          <ProgressContainer >
            <ProgressWrapper >
              <ProgressBar style={{width:`${modules.percentage*100||0}%`}}/>
            </ProgressWrapper>
            <PercentageSpan >{Math.round(modules.percentage*100)||0}%</PercentageSpan>
          </ProgressContainer>
          <ContainerPlayer >

            <VideoPlayer curso={curso}/>

            <SideVideoBarTry>
              <SideVideoBar curso={curso}/>
            </SideVideoBarTry>

          </ContainerPlayer>
        </Shadow>
      :null}
    </Container>
  );
}
