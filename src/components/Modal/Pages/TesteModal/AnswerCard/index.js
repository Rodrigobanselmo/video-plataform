import styled, {css} from "styled-components";
import { fade, lighten } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';



const AnswerView = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items:center;
  background-color: ${({theme})=>fade(theme.palette.status.fail,0.1)};
  gap: 5px 10px;
  padding: 10px 10px;
  border-radius:5px;
  color: ${({theme})=>theme.palette.text.primary};

  svg {
    font-size:30px;
    color: ${({theme})=>lighten(theme.palette.status.fail,0.2)};
  }

  p {
    grid-column: 2 / 3;
  }

  ${props => props.correct && css`
    background-color: ${({theme})=>fade(theme.palette.status.successD,0.1)};
    svg {
      font-size:30px;
      color: ${({theme})=>lighten(theme.palette.status.success,0.2)};
    }
  `}

`;


export function AnswerCard({question,correct}) {

  return (
    <AnswerView correct={correct}>
      {correct ? (
        <>
          <CheckIcon/>
          <b>Correta</b>
        </>
      ) : (
        <>
          <CloseIcon/>
          <b>Incorreta</b>
        </>
      )}
      {question?.why &&
        <p>{question?.why}</p>
      }
    </AnswerView>
  );
}
