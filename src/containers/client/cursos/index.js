import React, { useEffect } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import { useCursos } from '../../../services/hooks/get/useCursos';
import { useAuth } from '../../../context/AuthContext';
import { CardCurso } from '../../../components/Blocks/CardCurso';
import styled, { css } from "styled-components";
import { MissingData } from '../../../components/Main/Tables/elements/MissingData';
import { useHistory } from "react-router-dom"
import { CURSOS, CURSOS_CREATE } from '../../../routes/routesNames';
import { CardButton } from '../../../components/Blocks/CardButton';
import { CardButtonHorizontal } from '../../../components/Blocks/CardButtonHorizontal';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import AutorenewIcon from '@material-ui/icons/Autorenew';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div {
    display:flex;
    flex-direction:row;
    align-items:center;
    gap:25px;
    overflow-x:auto;
  }
  /* justify-content: center; */
  /* align-items: center; */
  /* background-color: red; */
`;


const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 1rem;

  &.bottom {
    margin-bottom: 10px;
  }

  &.mt {
    margin-top: 1rem;
  }
`;

export default function Cursos() {

  const  { data:dataCursos, isLoading:isLoadingCursos } = useCursos()
  const {currentUser} = useAuth()
  const history = useHistory()
  const notification = useNotification()
  const { setLoaderDash } = useLoaderDashboard();
  const isAdmin = currentUser.access==='admin';

  useEffect(() => {
      if (!isLoadingCursos) setLoaderDash(false)
  }, [isLoadingCursos])

  function handleChangeRoute(cursoId) {
    setLoaderDash(true)
    history.push(CURSOS + '/' +  cursoId)
  }

  function handleChangeCurso() {
    setLoaderDash(true)
    history.push(CURSOS_CREATE)
  }

  const onContinueCurso = React.useMemo(() => () => {
    if (!(dataCursos && currentUser?.cursos)) return false
    return currentUser.cursos.map((curso,index)=>{
      const cursoIndex = dataCursos.findIndex(i=>i.id == curso.id)
      if (cursoIndex == -1) return null
      if (curso?.expireDate && 'percentage' in curso && curso.percentage < 100) return true
      return null
    }).some(i=>i)
  }, [currentUser,dataCursos])

  const onAvailableAlmostCurso = React.useMemo(() => () => { // um caso disso seria distribuir o curso sem a pessoa comecar
    if (!(dataCursos && currentUser?.cursos)) return false
    return currentUser.cursos.map((curso,index)=>{
      const cursoIndex = dataCursos.findIndex(i=>i.id == curso.id)
      if (cursoIndex == -1) return null
      if (curso?.quantity && curso.quantity != 0 && !curso?.status) return true
      return null
    }).some(i=>i)
  }, [currentUser,dataCursos])

  const isAvailableAlmostCurso = onAvailableAlmostCurso()
  const isContinueCurso = onContinueCurso()

  return (
    <Container >
      {isAdmin &&
        <>
        <Title >Gerenciar Cursos</Title>
        <div style={{flex:1,display:'flex', flexDirection:'row',gap:30,marginBottom:40,padding:'3px 0',overflowX:'auto',overflowY:'visible'}}>
          <CardButtonHorizontal onClick={()=>handleChangeCurso()}>
            <ImportantDevicesIcon/>
            <p className="title">Adicinar Novos Cursos</p>
            <p className="text">Click aqui para adicinar <br/> novos cursos.</p>
          </CardButtonHorizontal>

          {/* <CardButtonHorizontal >
            <AutorenewIcon/>
            <p className="title">Editar Cursos Existentes</p>
            <p className="text">Click aqui para editar <br/> seus cursos.</p>
          </CardButtonHorizontal> */}
        </div>
      </>
      }

      {isContinueCurso &&
      <>
        <Title >Continuar assistindo</Title>
        <div>
          {dataCursos && currentUser.cursos.map((curso,index)=>{
            const cursoIndex = dataCursos.findIndex(i=>i.id == curso.id)
            const cursoData = dataCursos[cursoIndex]

            if (cursoIndex == -1) return null
            if (curso?.expireDate && curso?.status && 'percentage' in curso && curso.percentage < 100) {

              function getDateMessage() {
                const actualTime = new Date().getTime()
                if (actualTime < curso.expireDate) return `Vencimento: ${new Intl.DateTimeFormat("pt-BR").format(
                  new Date(curso.expireDate)
                )}`

                return 'expirado'
              }

              const text = getDateMessage()

              return (
                <CardCurso
                key={curso.id}
                onClick={()=>handleChangeRoute(curso.id)}
                image={cursoData.image}
                title={cursoData.name}
                text={text}
                />
              )
            }

            return null
          })}
        </div>
      </>
      }
      <Title className='mt' >Cursos disponíveis</Title>
      <div>
        {dataCursos && isAvailableAlmostCurso && currentUser.cursos.map(curso=>{
          const cursoIndex = dataCursos.findIndex(i=>i.id == curso.id)
          const cursoData = dataCursos[cursoIndex]

          if (cursoIndex == -1) return null
          if (
            curso?.quantity &&
            curso.quantity != 0 &&
            !curso?.status
          )
            return (
              <CardCurso
                key={curso.id}
                onClick={()=>handleChangeRoute(curso.id)}
                image={cursoData.image}
                title={cursoData.name}
                text={''}
              />
            )
          return null
        })}
        {!isAvailableAlmostCurso && <MissingData bigger text='Nenhum curso disponível // até o momento'/>}
      </div>
    </Container>
  );
}

