import React, {useState, useEffect,useMemo} from 'react';
// import AddModal, {Type,Form} from './comp'
import {userTypes,headCells,rows} from '../../../../constants/userTypes'
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useAuth } from '../../../../context/AuthContext'
import Carrousel, {PagesDiv} from '../../../Main/Carrousel/CarrouselFirst'
import { useSelector,useDispatch, useStore } from 'react-redux'
import { ModalFullScreen } from '../../ModalFullScreen';
import styled, {css} from "styled-components";
import { HeaderModal } from '../../Components/Header';
import { AddUserData } from '../../../Forms/AddUserData';
import { useQuery } from 'react-query';
import { db } from '../../../../lib/firebase.prod';
import { useCreateUsers } from '../../../../services/hooks/set/useCreateUsers';
import { fade, lighten, darken } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ButtonForm } from '../../../Dashboard/Components/Form/comp';
import { useCountdown } from '../../../../hooks/useCountdown';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { AnswerCard } from './AnswerCard';
import { TryAgainCard } from './TryAgainCard';

const Timer = styled.p`
      border-bottom: 1px solid ${({theme})=> theme.palette.background.line};
      font-size:0.9rem;
      color: ${({theme})=>theme.palette.text.secondary};
      font-weight: bold;
      position:fixed;
      background-color: ${({theme})=>theme.palette.background.default};
      z-index:10;
      width:100%;
      padding:20px 0vw 10px 0vw;
      width:80vw;
      top:0;
      left:10vw;
`;



const Container = styled.div`
    display:flex;
    z-index:1;
    flex-direction:column;
    overflow-x:hidden;
    overflow-y:auto;
    padding:50px 10vw 20px 10vw;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100%;
    margin-bottom:50px;
    scroll-behavior: smooth;
    position:relative;



    > h1 {
      margin-bottom: 15px;
      margin-top: 40px;
      font-size:2rem;
    }

    > ol {
      /* list-style-position: inside; */
      margin-left:20px;
      border-bottom: 1px solid ${({theme})=> theme.palette.background.line};

    }

    @media screen and (max-width: 800px) {
      padding:50px 4vw 20px 4vw;
    }
`;

const List = styled.li`
  font-size:1rem;
  padding-left:15px;
  color: ${({theme})=>fade(theme.palette.text.primary,0.75)};
  padding-bottom: 30px;
  cursor: pointer;

  ${props => props.error && css`
    color: ${({theme})=>theme.palette.status.fail};
  `}
`;

const OptionView = styled.div`
  color: ${({theme})=>fade(theme.palette.text.primary,0.75)};
  display:flex;
  align-items:center;
  gap: 20px;
  margin-top: ${({mt})=>mt}px;
  margin-bottom: 25px;

  &:before {
    content: "";
    display:inline-block;
    /* align-self:flex-start; */
    position:relative;
    min-width: 12px;
    min-height: 12px;
    border-radius:50px;
    margin-bottom:3px;
    box-sizing:border-box;
    /* padding:2px; */
    box-shadow:
        0 0 0 3px ${({theme})=>theme.palette.background.default},
        0 0 0 5px ${({theme})=>theme.palette.background.inactive};
    flex-shrink:0;
  }

  &:hover {
    color: ${({theme})=>theme.palette.primary.main};
    &:before {
      box-shadow:
        0 0 0 3px ${({theme})=>theme.palette.background.default},
        0 0 0 5px ${({theme})=>theme.palette.primary.main};
    }
  }

  ${props => props.active && css`
    color: ${({theme})=>theme.palette.primary.main};
    &:before {
      box-shadow:
        0 0 0 3px ${({theme})=>theme.palette.background.default},
        0 0 0 5px ${({theme})=>theme.palette.primary.main};
      background-color: ${({theme})=>theme.palette.primary.main};
    }
  `}

  ${props => props.correct && css`
    color: ${({theme})=>darken(theme.palette.status.successD,0.2)};
    &:before {
      box-shadow:
        0 0 0 3px ${({theme})=>theme.palette.background.default},
        0 0 0 5px ${({theme})=>darken(theme.palette.status.successD,0.2)};
      background-color: ${({theme})=>theme.palette.status.success};
    }

    &:hover {
      color: ${({theme})=>darken(theme.palette.status.successD,0.2)};
      &:before {
        box-shadow:
          0 0 0 3px ${({theme})=>theme.palette.background.default},
          0 0 0 5px ${({theme})=>darken(theme.palette.status.successD,0.2)};
      }
    }
  `}
`;

export const FormLabel = styled(FormControlLabel)`
  color: ${({theme})=>theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 20px;
`;

export function TestModal({open,setOpen,actualClass,mutation,handleSubmitTest}) {


  const {currentUser} = useAuth();
  const notification = useNotification();
  // const {setLoad} = useLoaderScreen();
  const {ref , action} = useCountdown(()=>{
    notification.modal({
      title: 'Seu tempo expirou',
      text:'Você passou do tempo máximo de execução do teste, por favor tente novamente mais tarde.',
      rightBnt:'Sair',
      open:true,
      onClick:()=>{
        handleResetTest();
        setOpen(false)
      },
      onClose:()=>{
        onClose();
      }
    })
  });
  const { cursoId,moduleId,classId } = useParams();


  const [selected, setSelected] = useState({})
  const [check, setCheck] = useState(false)
  const [error, setError] = useState([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const maxTime = actualClass.maxTime*60*1000;
    if (!ref?.current?.innerHTML && open) action.setTimer(maxTime)
  }, [open])

  function handleSelect(question,option) {
    if (finished) return null;

    const key = `${cursoId}//${moduleId}//${classId}`;
    const insert = {
      [question.id]: option.text
    }

    setSelected(selected=>({
      ...selected,
      ...insert
    }))

    if (error.length > 0 && !error.includes(question.id)) setError(error=>[...error,question.id])

    // dispatch({ type: 'PROGRESS_UPDATE_ANSWER', payload: { key, insert } }) //PROGRESS_DISPATCH
  }

  const handleCheck = (event) => {
    setCheck(event.target.checked);
  };

  const onSetAllErrors = () => {
    const errors = [...Object.keys(selected)]; // add itens that is selected, itens that are not here are in error
    setError(errors)

    notification.error({message:'Responda todas as perguntas para finalizar!'})
  };

  const onGetAnswers = () => {
    const good = [];
    const wrong = [];
    actualClass.questions.map(question=>{
      if (selected[question.id] == question.answer) good.push(question.id)
      else wrong.push(question.id)
    })
    const total =  (good.length+wrong.length)
    const number =  good.length/total*100
    const grade =  number.toFixed(2)
    const numToPass = actualClass.numToPass
    const percentage =  good.length >= numToPass ? 100 : 0;

    const data = [{correctAnswers:good,total,grade,date:(new Date().getTime())}]

    return {data,percentage}
  }

  const handleFinishTest = () => {
    if (finished) onClose();
    const numQuestions = actualClass.numQuestions
    const numResponseQuestions = Object.keys(selected).length

    if (numQuestions != numResponseQuestions) {
      return onSetAllErrors()
    }

    if (!check) return notification.error({message:'Selecione o item acima para finalizar.'})

    const testData = onGetAnswers()

    handleSubmitTest(testData,()=>{
      document.getElementById('teste_modal_container').scrollTop = 0
      setFinished(testData)
      action.clearTimer()
    })
  };

  function handleResetTest() {
      // if (mutation.isLoading) return
      setCheck(false)
      setSelected({})
      setError([])
      setFinished(false)
      action.clearTimer()

      const maxTime = actualClass.maxTime*60*1000;
      action.setTimer(maxTime)
  }

  function onClose() {
    // if (mutation.isLoading) return
    setOpen(false)
    setCheck(false)
    setSelected({})
    setError([])
    setFinished(false)

    action.clearTimer()
  }


  const infoModal = {title:'Você tem certeza?',text:'Ao sair você irá perder seu progresso até o momento.'}
  const infoDoneModal = {title:'',text:''}

  return (
    <ModalFullScreen open={open} onClose={onClose} infoModal={finished?infoDoneModal:infoModal} >
      <Timer>TEMPO LÍMITE DE TESTE: <span ref={ref}></span></Timer>
      <Container id='teste_modal_container'>
        <h1>{actualClass.name}</h1>
        {finished &&
          <TryAgainCard
            resetTest={handleResetTest}
            onClose={onClose}
            finished={finished}
            actualClass={actualClass}
          />
        }
        <ol>
        {actualClass?.questions && actualClass.questions.map((question)=>{
          const applyError = error.length>0 && !error.includes(question.id)
          const isCorrectAnswer =
            finished &&
            Object.values(selected).includes(question.answer)

          return (
              <List   error={applyError} key={question.id} >
                <span>{question.text}</span>
                {question.options.map((option,opIndex)=>{
                  const isActive =
                    selected[question.id] &&
                    selected[question.id] == option.text
                  const isCorrect =
                    finished &&
                    question.answer &&
                    question.answer == option.text

                  return (
                    <OptionView
                      onClick={()=>handleSelect(question,option)}
                      key={option?.id ?? option?.text}
                      active={isActive}
                      correct={isCorrect}
                      mt={opIndex===0?22:0}
                    >
                      {option.text}
                    </OptionView>
                    )

                  })
                }
                {finished && <AnswerCard correct={isCorrectAnswer} question={question}/>}
              </List>
              )

          })}
        </ol>
        <FormLabel
          control={
            <Checkbox
              checked={check}
              onChange={handleCheck}
              name="checked"
              color="primary"
            />
          }
          label={`Eu, ${currentUser.name}, confirmo que realizei este teste com meus conhecimentos adquiridos até o momento e sem a ajuda de terceiros, e que a ajuda de terceiros pode resultar na anulação dos meus resultados provenientes dessa avaliação.`}
        />
        <ButtonForm
          loading={mutation.isLoading}
          onClick={handleFinishTest}
          secondary="true"
          style={{ width: 'fit-content' }}
        >
          {finished ? (
            'FECHAR'
          ) : (
            'FINALIZAR TESTE'
          )}
        </ButtonForm>
        {/* <p>NÚMERO TOTAL DE QUESTÕES {actualClass.numQuestions}</p> */}
      </Container>
    </ModalFullScreen>
  );
}
