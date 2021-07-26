import React, { useState } from 'react'
import styled, {css} from "styled-components";
import { ButtonForm } from '../../Dashboard/Components/Form/comp';
import { TestModal } from '../../Modal/Pages/TesteModal';
import { useCountdown } from '../../../hooks/useCountdown';
import { useUpdateCurso } from '../../../services/hooks/set/useUpdateCurso';
import { useParams } from 'react-router';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { fade, lighten, darken } from '@material-ui/core/styles';


const TestWrapper = styled.div`
  /* position: absolute; */
  /* top:0; */
  /* left:0; */
  width:100%;
  height:100%;
  padding:20px;
  margin-top: -56.25%;


  @media screen and (max-width: 700px) {
    margin-top: -56.25%;
    position: relative;
    width:100%;
    height:fit-content;
  }
`;

const InfoWrapper = styled.div`
  margin-top:10px;
  background-color: ${({theme})=>theme.palette.background.paper};
  padding: 10px 15px;
  border-radius:10px;
  position:relative;

  > div {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content: space-between;
    margin-bottom:12px;
  }

  > div h2 {
    font-size:1.4rem;
  }

  > div p {
    font-size:1.2rem;
    /* background-color: ${({theme})=>theme.palette.status.successD}; */
    color: ${({theme})=>darken(theme.palette.status.successD,0.2)};
    font-weight:bold;
    border-radius:5px;
  }

  > p {
    font-size:1rem;
    > b {
      white-space: nowrap;
    }
  }

  > ul {
    margin-left:20px;
    font-size:0.87rem;
    margin-bottom:15px;
    color: ${({theme})=>theme.palette.text.primary};
    margin-top:5px;

    > li {
      opacity:0.7;
    }
    /* font-weight:bold; */
  }
`;

const TitleView = styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
  color: ${({theme})=>theme.palette.text.primary};
  gap:10px;
  margin-bottom:20px;

  h1 {
    opacity:0.8;
  }
`;

const TextTry = styled.p`
  margin-top:10px;
`;


const RowWrapper = styled.div`
  max-height:200px;
  overflow-y:auto;
  padding: 10px 0;
`;

const RowTry = styled.div`

  display:flex;
  align-items:center;
  color: ${({theme})=>theme.palette.text.primary};
  background-color: ${({theme})=>fade(theme.palette.status.fail,0.1)};
  overflow-y:auto;
  padding:5px 20px;
  margin-bottom: 10px;
  gap:20px;

  svg {
    color: ${({theme})=>theme.palette.status.fail};
  }

  div {
    display:flex;
    flex:1;
    flex-direction:column;
  }

  ${props => props.approved && css`
    background-color: ${({theme})=>fade(theme.palette.status.successD,0.1)};
    svg {
      color: ${({theme})=>lighten(theme.palette.status.success,0.2)};
    }

  `}

  ${props => props.inactive && css`
    background-color: ${({theme})=>fade(theme.palette.status.info,0.25)};
  `}

`;

export function TestView({
  actualClass,
  student,
  nextModule,
  nextClass,
  classIndex,
  moduleIndex
}) {

  const { cursoId,moduleId,classId } = useParams();
  const mutation = useUpdateCurso(cursoId)
  const [open, setOpen] = useState(false)

  function handleStartTest() {
    setOpen(true)
  }


  async function handleSubmitTest(data,callback) {
    await mutation.mutateAsync({cursoId,moduleId,classId,nextModule,nextClass,classIndex,moduleIndex,testData:data})
    callback()
  }

  const test = student[`${cursoId}//${moduleId}//${classId}`]
  ? student[`${cursoId}//${moduleId}//${classId}`]
  : {}

  const testData = test?.data ?? []
  const testPass = !!(test?.percentage == 100)

  return (
    <TestWrapper >
      <TitleView>
        <CheckIcon style={{fontSize:30}}/>
        <h1 >{actualClass.name}</h1>
      </TitleView>

      <InfoWrapper>
        <div>
          <h2>Sobre o teste</h2>
          {testPass && <p>Aprovado</p>}
        </div>
        <p>
          Número total de questões:&nbsp;<b>{actualClass.numQuestions} questões</b>
        </p>
        <p>Acertos para passar:&nbsp;<b>{actualClass.numToPass} questões</b></p>
        <ul>
          <li>
            {Math.floor(Number(actualClass.numToPass)/Number(actualClass.numQuestions)*100)}% de acerto
          </li>
        </ul>
        <p>Tempo máximo para realizar o teste:
          &nbsp;<b>{actualClass.maxTime} minutos</b>
        </p>

      </InfoWrapper>
      <ButtonForm
        // loading={mutation.isLoading}
        onClick={handleStartTest}
        jusify="center"
        secondary="true"
        style={{ width: 'fit-content' }}
      >
        {testPass?'REFAZER TESTE':'COMEÇAR TESTE'}
      </ButtonForm>

      <TextTry>Tentativas</TextTry>
      <RowWrapper>
        {testData.sort((a, b)=>(b.date - a.date)).map((item=>{
          const approved = item.correctAnswers.length >= actualClass.numToPass;
          const date = Intl.DateTimeFormat("pt-BR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric', minute: 'numeric'
          }).format(
            new Date(item.date)
          )

          return (
            <RowTry key={item.date} approved={approved} >
              {approved? <CheckIcon/>: <CloseIcon/>}
              <div>
                <strong>Data de finalização</strong>
                <p>{date}</p>
              </div>
              <div>
                <strong>nota</strong>
                <span>{item.grade}%</span>
              </div>
            </RowTry>
          )
        }))}
        {testData.length === 0 && (
          <RowTry inactive>
            <strong>Você ainda não tem nenhuma tentativa</strong>
          </RowTry>
        )}
      </RowWrapper>

      <TestModal
        open={open}
        setOpen={setOpen}
        actualClass={actualClass}
        student={student}
        handleSubmitTest={handleSubmitTest}
        mutation={mutation}
      />
    </TestWrapper>
  )
}
