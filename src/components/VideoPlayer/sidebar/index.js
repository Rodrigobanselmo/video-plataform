import React, { useEffect, useState } from 'react';
import {TestIcon, AulasContainer,NumberOfClassesText,TitleModule,TextWrapper,CircleView,NumberCircle,ModuleContainer,SideContainer,IconArrow,IconLock,Text,Line,ShadowCircle,FillCircle,Circle,AulaWrapper} from './style'
import { useSelector,useDispatch } from 'react-redux'
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useNotification} from '../../../context/NotificationContext'
import {isLocked} from '../func'
import { FaFileDownload } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';

// import {DASHBOARD,ADMIN_PERFIL} from '../../../routes/routesNames'

import { useParams,useHistory } from 'react-router-dom';
import { queryClient } from '../../../services/queryClient';
import { VIDEO_ROUTE } from '../../../routes/routesNames';
import { useAuth } from '../../../context/AuthContext';
import styled, {css} from "styled-components";

const EndIcon = styled(GiPartyPopper)`
  position: absolute;
  z-index: 10;
  color:  ${({theme})=>theme.palette.text.secondary};

  ${props => props.selected && css`
    color: ${({theme})=>theme.palette.status.success};
  `}
`;

const MaterialIcon = styled(FaFileDownload)`
  position: absolute;
  z-index: 10;
  color:  ${({theme})=>theme.palette.text.secondary};
`;



export function SideVideoBar({curso,show,...props}) {


  const { currentUser } = useAuth();
  const { cursoId,moduleId,classId } = useParams();
  const queryModules =  queryClient.getQueryData(['student',cursoId, currentUser.uid]);
  const modules =  (queryModules && queryModules?.student) ? queryModules.student[0] : {};

  const [open, setOpen] = useState('')
  // const modules = useSelector(state => state.modules)
  const notification = useNotification();
  const dispatch = useDispatch()
  const history = useHistory()
  // console.log(modules)
  const pathname = VIDEO_ROUTE + '/' +cursoId

  //dispatch({ type: 'ROUTE', payload: location })
  // history.push(pathname+'/'+curso.modules[0].id+'/'+curso.modules[0].classes[0].id)



  // const moduleIndex = curso.modules.findIndex(i=>i.id==moduleId);
  // const classIndex = curso.modules[moduleIndex].classes.findIndex(i=>i.id==classId);
  // const actualClass = curso.modules[moduleIndex].classes[classIndex];

  // const oldClass = classIndex == 0
  //   ? curso.modules[moduleIndex-1].classes[curso.modules[moduleIndex-1].classes.length-1]
  //   : curso.modules[moduleIndex].classes[classIndex-1];

  // const nextClass = classIndex == curso.modules[moduleIndex].classes.length - 1
  //   ? curso.modules[moduleIndex+1].classes[0]
  //   : curso.modules[moduleIndex].classes[classIndex+1];


  useEffect(() => {
    if (!show) setTimeout(() => {
      setOpen(moduleId)
    }, 700);
  }, [moduleId,classId])

  function HandleOpenClasses(id) {
    if (open == id) return setOpen('')
    setOpen(id)
  }

  function handleSetClass(moduleId,classId,isLocked) {
    if (show) return null
    if (isLocked !== 'ok') return notification.warn({message:isLocked})
    history.push(pathname+'/'+moduleId+'/'+classId)
  }

  function handleEndClasses() {
    console.log('modules',modules)
    if (modules.percentage < 1) return notification.warn({message:'Você precisa finalizar o curso para ter acesso a essa parte'})
    history.push(pathname+'/certificado')
  }

  function handleDownloadMaterial(url) {
    if (!url) return null;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('target', '_blank');

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  }


  return (
    <SideContainer {...props}>
      {curso.modules.map((module,index)=>{

        const watchedClasses = (modules?.watched && modules.watched[module.id]) ? modules.watched[module.id].length : 0
        const totalClasses = module.classes.filter(i=>!i?.type).length

        return (
          <div key={module.id} >
            <ModuleContainer first={index == 0} onClick={()=>HandleOpenClasses(module.id)}>
              <CircleView >
                <NumberCircle >{index+1}</NumberCircle>
                <CircularProgress color={'inherit'} thickness={3.5} style={{position:'absolute',top:-6,right:-6}} size={52} variant="determinate" value={watchedClasses/totalClasses*100} />
              </CircleView>
              <TextWrapper >
                <TitleModule >{module.name}</TitleModule>
                <NumberOfClassesText>{totalClasses} aulas</NumberOfClassesText>
              </TextWrapper>
              { false ?
                <IconLock style={{fontSize:'18px'}}/>
              :
                <IconArrow isopenmodule={(open == module.id).toString()} style={{fontSize:'22px'}}/>
              }
            </ModuleContainer>
            <Collapse unmountOnExit={true} in={open == module.id}>
              <AulasContainer >
                {index === 0 && curso?.material &&
                  <AulaWrapper onClick={()=>handleDownloadMaterial(curso.material[1])}>
                    <Circle >
                      <MaterialIcon size={18}/>
                    </Circle>
                    <Text>Material Didático</Text>
                  </AulaWrapper>
                }
                {module.classes.map((aula,aulaIndex)=>{
                  const percentage = modules[`${curso.id}//${module.id}//${aula.id}`] && modules[`${curso.id}//${module.id}//${aula.id}`]?.percentage
                    ? modules[`${curso.id}//${module.id}//${aula.id}`]?.percentage
                    : 0

                  const isLast = module.classes.length == aulaIndex + 1
                  const isTest = aula.type === 'test'
                  const isNextTest = !isLast && module.classes[aulaIndex+1] && module.classes[aulaIndex+1].type === 'test'

                  return (
                    <AulaWrapper onClick={()=>handleSetClass(module.id,aula.id,isLocked(modules,aula,index,aulaIndex))} key={aula.id}>
                      <Circle >
                        {isTest
                          ? <TestIcon active={percentage === 100} selected={classId==aula.id}  size={12}/>
                          :
                          <>
                            <FillCircle active={classId==aula.id || percentage === 100}/>
                          </>
                        }
                        <ShadowCircle test={isTest} selected={classId==aula.id}/>
                        <Line active={percentage === 100} last={isLast || isNextTest || isTest}/>
                      </Circle>
                      <Text active={percentage === 100}>{aula.name}</Text>
                      {isLocked(modules,aula,index,aulaIndex) !== 'ok' && <IconLock style={{fontSize:'14px'}}/>}
                    </AulaWrapper>
                  )
                })}
                {index === curso.modules.length - 1 && curso?.material &&
                  <AulaWrapper  onClick={()=>handleEndClasses()}>
                    <Circle >
                      <EndIcon selected={moduleId === 'certificado'} size={18}/>
                    </Circle>
                    <Text active={moduleId === 'certificado'}>Certificado</Text>
                    {modules.percentage < 1 && <IconLock style={{fontSize:'14px'}}/>}
                  </AulaWrapper>
                }
              </AulasContainer>
            </Collapse>
          </div>
        )
      })}
    </SideContainer>
  )
}
