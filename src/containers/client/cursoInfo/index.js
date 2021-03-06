import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import { useCurso } from '../../../services/hooks/get/useCurso';
import { useAuth } from '../../../context/AuthContext';
import { CardCurso } from '../../../components/Blocks/CardCurso';
import { MissingData } from '../../../components/Main/Tables/elements/MissingData';
import { useHistory,useParams } from "react-router-dom"
import { CURSOS, VIDEO_ROUTE } from '../../../routes/routesNames';
import { CardInfo } from '../../../components/Blocks/CardInfo';
import { CursoTabs } from '../../../components/Blocks/CursoTabs';
import {ContinueButton} from '../../../components/Main/MuiHelpers/Button'
import { SideVideoBar } from '../../../components/VideoPlayer/sidebar';
import PlayArrowIcon from "@material-ui/icons/PlayCircleOutline";
import { Container,CursoCard,SideVideoBarTry  } from './styles';
import { useStartCurso } from '../../../services/hooks/set/useStartCurso';
import { queryClient } from '../../../services/queryClient';
import { ModalButtons } from '../../../components/Main/MuiHelpers/ModalButtons';


export default function CursoInfo() {

  const { cursoId } = useParams();
  const  { data, isLoading } = useCurso({cursoId})
  const mutation = useStartCurso()
  const {currentUser} = useAuth()
  const history = useHistory()
  const notification = useNotification()
  const { setLoaderDash } = useLoaderDashboard();
  const [open, setOpen] = useState(false);

  useEffect(() => {
      if (!isLoading) setLoaderDash(false)
      if (!isLoading && data.length == 0) return history.push(CURSOS)
  }, [isLoading])

  async function handleChangeRoute() {
    setLoaderDash(true)
    await mutation.mutateAsync(data[0])
  }

if (!data || (data && !data[0])) return null

  function IsAvailable() {
    if (!currentUser?.cursos) return false
    const userCursoIndex = currentUser.cursos.findIndex(i=>i.id == data[0].id)
    if (userCursoIndex === -1) return false
    if (currentUser.cursos[userCursoIndex]?.expireDate && currentUser.cursos[userCursoIndex]?.expireDate < new Date().getTime()) return false
    if (!currentUser.cursos[userCursoIndex]?.expireDate && currentUser.cursos[userCursoIndex].status == 'finished') return true
    if (currentUser.cursos[userCursoIndex]?.expireDate && currentUser.cursos[userCursoIndex].status == 'finished' && currentUser.cursos[userCursoIndex]?.expireDate > new Date().getTime()) return true
    if (currentUser.cursos[userCursoIndex].status == 'started') return true
  }

  function onTotalClasses(IsCursoAvailable,numClasses,numSubClasses) {
    if (IsCursoAvailable) {
      const userCursoIndex = currentUser.cursos.findIndex(i=>i.id == data[0].id)
      if (currentUser.cursos[userCursoIndex]?.epi) {
        return numClasses + currentUser.cursos[userCursoIndex].epi.length
      }
      return numClasses + numSubClasses

    } else {
      return numClasses + numSubClasses
    }
  }

  const cursoData = data[0];
  const cursoName = cursoData.name;
  const duration = cursoData.duration;
  const numModules = cursoData.numOfModules;
  const numClasses = cursoData.numOfClasses;
  const numSubClasses = cursoData?.subCursos ?? 0;


  const daysToExpire = Number(data[0].daysToExpire);
  const expire = new Date(
    new Date().setDate(new Date().getDate() + Number(daysToExpire)),
  );
  const expireFotmated = new Intl.DateTimeFormat("pt-BR").format(
    new Date(expire)
  )
  const IsCursoAvailable = IsAvailable();
  const totalClasses = onTotalClasses(IsCursoAvailable,numClasses,numSubClasses)


  function onOpenModal() {
    if (IsCursoAvailable) return handleChangeRoute()
    setOpen(true)
  }

  function onCloseModal() {
    setOpen(false)
  }

  return (
    <Container >
      <h1>{cursoName}</h1>
      <p>Selecionamos e organizamos todas as informa????es que voc?? precisa para atender os protocolos oficiais contra o COVID-19.</p>
      <CardInfo
        image={'/images/clock.png'}
        title={'Tempo Estimado'}
        text={`--${duration}-- --_-- --horas-- para finalizar // todas as aulas e testes`}
        alt='novo curso'
        style={{gridArea:'c1'}}
        horizontal
      />
      <CardInfo
        image={'/images/target.png'}
        title={'Tempo para Conclus??o'}
        text={daysToExpire?`Voc?? ter?? at?? --${daysToExpire}-- --_-- --dias-- para finalizar o curso`:'Voc?? n??o ter?? um limite de tempo para finalizar o curso'}
        alt='novo curso'
        style={{gridArea:'c2'}}
        horizontal
      />
      <CardInfo
        onClick={()=>{}}
        image={'/images/file-tree.png'}
        title={'Divis??o do Curso'}
        text={`N??mero de M??dulos: ${numModules} // N??mero de aulas: ${totalClasses}`}
        alt='novo curso'
        style={{gridArea:'c3'}}
        horizontal
      />
      <div className={'aside'}>
        <CursoCard className={'imageCard'} onClick={onOpenModal} imageURL={cursoData.image}>
          <div className="backImage" />
          <div className="gradient" >
            <PlayArrowIcon style={{fontSize:70}} />
            {IsCursoAvailable?'CONTINUAR CURSO':'COME??AR CURSO'}
          </div>
        </CursoCard>
        {/* <ContinueButton primary style={{height:50,width:200,width:'100%'}}>COME??AR CURSO</ContinueButton> */}
      </div>

      <h2>Informa??es</h2>
      {data && <CursoTabs
        style={{gridArea:'bt'}}
        data={data}
        cursoId={cursoId}
      />}

      <h3>M??dulos</h3>
      <SideVideoBarTry style={{gridArea:'bs'}}>
        <SideVideoBar show curso={cursoData}/>
      </SideVideoBarTry>
      <ModalButtons
        open={open}
        onClick={handleChangeRoute}
        onClose={onCloseModal}
        rightBnt='COME??AR CURSO'
        leftBnt='CANCELAR'
        title={'INICIAR CURSO'}
      >
        <p style={{marginTop:0,fontSize:'1.1rem'}}>Curso: <strong>{cursoName}</strong></p>
        <p style={{marginTop:5,fontSize:'1.1rem'}}>Tempo Estimado: <strong>{duration} horas</strong></p>
        { data[0].daysToExpire ? <div style={{marginTop:15,border:'1px solid grey',padding:10,borderRadius:10,backgroundColor:'#fafafa'}}>
          <p style={{marginTop:0,fontWeight:'bold',fontSize:'0.99rem',color:'#990000'}}>Voc?? tem certeza?</p>
          <p style={{marginTop:5,marginBottom:20,fontSize:'1.1rem',width:'80vw',maxWidth:600}}>Ao come??ar o curso voc?? ter?? at?? <strong style={{color:'#990000'}}>{expireFotmated}</strong> para finaliza-lo, caso contr??rio ter?? que assistir novamente todas as aulas para obter o certificado.</p>
        </div> : null}
      </ModalButtons>
    </Container>
  );
}

// return (
//   <Container >
//     <div style={{display:'flex',flexDirection:'row',gap:20,flex:1,width:'100%',alignItems:'flex-end',marginBottom:30,flexWrap:'wrap'}}>
//       <div style={{display:'flex',flexDirection:'column',flex:5,width:'100%', minWidth:400}}>
//         <Title >Gerenciar Cursos</Title>
//         <p>Selecionamos e organizamos todas as informa????es que voc?? precisa para atender os protocolos oficiais contra o COVID-19.</p>
//         <div style={{flex:1,display:'flex',flexWrap:'wrap',gap:30,marginTop:40,padding:'0px 0'}}>
//           <CardButton
//             onClick={()=>{}}
//             image={'/images/curso-online.png'}
//             title={'Tempo Estimado'}
//             text={'4 horas para finalizar // todas as aulas e testes'}
//             alt='novo curso'
//             small
//           />
//           <CardButton
//             onClick={()=>{}}
//             image={'/images/curso-online.png'}
//             title={'Tempo para Conclus??o'}
//             text={'Tempo m??ximo para ser conclu??do ?? de 14 dias'}
//             alt='novo curso'
//             small
//           />
//           <CardButton
//             onClick={()=>{}}
//             image={'/images/curso-online.png'}
//             title={'Divis??o do Curso'}
//             text={'N??mero de M??dulos: 3 // N??mero de aulas: 26'}
//             alt='novo curso'
//             small
//           />
//         </div>
//       </div>
//       <div style={{display:'flex',flexDirection:'column',flex:2,width:'100%', minWidth:300}}>
//           <CardCurso
//             onClick={()=>handleChangeRoute(cursoData.id)}
//             image={cursoData.image}
//             title={cursoData.name}
//             text={''}
//           />
//         <ContinueButton style={{height:50,width:200,width:'100%'}}>COME??AR CURSO</ContinueButton>
//       </div>
//     </div>

//   </Container>
// );
