import styled, {css} from "styled-components";
import { fade, lighten } from '@material-ui/core/styles';
import { queryClient } from "../../../../../services/queryClient";
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { useParams } from "react-router";
import CheckIcon from '@material-ui/icons/Check';


const TryView = styled.div`
  display: grid;
  grid-template-columns: 30px 3fr minmax(200px,1fr) 1fr;
  align-items:center;
  background-color: ${({theme})=>fade(theme.palette.status.fail,0.1)};
  gap: 5px 20px;
  padding: 10px 10px;
  border-radius:5px;
  color: ${({theme})=>theme.palette.text.primary};
  margin-bottom:20px;
  grid-template-areas:
  "s h b d"
  "n p b d";


  svg {
    grid-area: s;
    font-size:30px;
    color: ${({theme})=>lighten(theme.palette.status.fail,0.2)};
  }

  h1 {
    grid-area: h;
  }

  p {
    grid-area: p;
    font-weight:bold;
  }

  span {
    font-weight:500;
    opacity:0.8;
  }

  button {
    grid-area: b;
    width:fit-content;
    padding:10px 20px;
    font-weight:bold;
    font-size:1rem;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.22);
    border: none;

    &:hover {
      filter: brightness(0.95)
    }

    &:active {
      filter: brightness(0.91)
    }

  }

  div {
    padding-left:20px;
    border-left: 2px solid ${({theme})=> theme.palette.background.line};
    grid-area: d;

    p {
      font-size: 0.82rem;
      line-height: 1.125rem;
      font-weight:bold;
      color: ${({theme})=>lighten(theme.palette.text.primary,0.2)};
    }

    span {
      color: ${({theme})=>theme.palette.status.fail};
      font-size: 1.5rem;
    }
  }

  ${props => props.approved && css`
    background-color: ${({theme})=>fade(theme.palette.status.successD,0.1)};
    svg {
      color: ${({theme})=>lighten(theme.palette.status.success,0.2)};
    }
    div > span {
      color: ${({theme})=>lighten(theme.palette.status.success,0.2)};
    }
  `}


  @media screen and (max-width: 1100px) {
    grid-template-columns: 30px 200px 1fr;
    grid-template-areas:
      "s h h"
      "n p p"
      "n b d";

    p {
      margin-bottom:10px;
    }
    gap: 5px 0px;
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 30px 1fr 1fr;
    grid-template-areas:
      "s h h"
      "n p p"
      "n b d";

    h1 {
      font-size:1.3rem
    }

    p {
      margin-bottom:10px;
    }

    div {
      border-left: none;
    }

  }

`;


export function TryAgainCard({actualClass,finished, resetTest, onClose}) {

  // const { cursoId } = useParams();
  // const queryModules =  queryClient.getQueryData(['student', cursoId]);
  // const student =  (queryModules && queryModules?.student) ? queryModules.student[0] : {};

  const APPROVED = finished.percentage === 100

  const TITLE_FAIL = 'Tente novamente quando estiver preparado'
  const TITLE_SUCCESS = 'Parabéns, você foi aprovado'
  const PERCENTAGE_TO_PASS = Math.floor(actualClass.numToPass/actualClass.numQuestions*10000)/100

  const GRADE = finished.data[0].grade

  function handleButtonTryAgain() {
    if (APPROVED) {
      onClose()
    } else {
      resetTest()
    }
  }

  return (
    <TryView approved={APPROVED}>
      {APPROVED ? <CheckIcon/> : <PriorityHighIcon/>}
      <h1>{APPROVED?TITLE_SUCCESS:TITLE_FAIL}</h1>
      <p>PARA SER APROVADO <span>{PERCENTAGE_TO_PASS}% ou superios</span></p>
      <button onClick={handleButtonTryAgain}>{APPROVED?'Continuar curso':'Tentar novamente'}</button>
      <div>
        <p>Nota</p>
        <span>{GRADE}%</span>
      </div>
    </TryView>
  );
}
