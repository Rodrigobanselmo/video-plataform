import React, { useEffect } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import { useCursos } from '../../../services/hooks/get/useCursos';
import { useAuth } from '../../../context/AuthContext';
import { CardCurso } from '../../../components/Blocks/CardCurso';
import styled from "styled-components";
import { MissingData } from '../../../components/Main/Tables/elements/MissingData';
import { useHistory } from "react-router-dom"
import { CURSOS } from '../../../routes/routesNames';
import { CardButton } from '../../../components/Blocks/CardButton';

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
`;

export default function Cursos() {

  const  { data:dataCursos, isLoading:isLoadingCursos } = useCursos()
  const {currentUser} = useAuth()
  const history = useHistory()
  const notification = useNotification()
  const { setLoaderDash } = useLoaderDashboard();

  useEffect(() => {
      if (!isLoadingCursos) setLoaderDash(false)
  }, [isLoadingCursos])

  function handleChangeRoute(cursoId) {
    history.push(CURSOS + '/' +  cursoId)
  }

  return (
    <Container >
      <Title >Gerenciar Cursos</Title>
      <div style={{flex:1,display:'flex', flexDirection:'row',gap:30,marginBottom:40,padding:'3px 0',overflowX:'auto',overflowY:'visible'}}>
        <CardButton
          onClick={()=>{}}
          image={'/images/curso-online.png'}
          title={'Adicinar Novo Curso'}
          text={'Click aqui para adicinar // novos cursos.'}
          alt='novo curso'
          small
        />
        {/* <CardButton
          onClick={()=>{}}
          image={'/images/curso-online.png'}
          title={'Adicinar Novo Curso'}
          text={'Click aqui para adicinar // novos cursos.'}
          alt='novo curso'
        /> */}
      </div>
      {/* <Title >Cursos que você esta fazendo</Title>
      <div>
        <MissingData bigger text='Nenhum curso até // o momento'/>
      </div> */}
      <Title >Cursos disponíveis</Title>
      <div>
        {dataCursos && currentUser.cursos.map(curso=>{
          const cursoIndex = dataCursos.findIndex(i=>i.id == curso.id)
          const cursoData = dataCursos[cursoIndex]

          if (cursoIndex == -1) return null
          if (curso?.quantity && curso.quantity != 0) return (
            <CardCurso
              onClick={()=>handleChangeRoute(curso.id)}
              image={cursoData.image}
              title={cursoData.name}
              text={''}
            />
          )

          return null
        })}
      </div>
    </Container>
  );
}

