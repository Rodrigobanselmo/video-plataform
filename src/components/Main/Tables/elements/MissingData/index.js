import React from 'react'
import styled,{css} from "styled-components";
import Skeleton from '@material-ui/lab/Skeleton';
import { BreakLineText } from '../../../../../helpers/StringHandle';


const Container = styled.div`
  padding: 10px;
  display:flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin-bottom:40px;
  /* border: 1px solid ${({theme})=> theme.palette.background.line }; */
  /* cursor:pointer; */


  img {
    width:50px;
    height:50px;
    margin-right:20px;
    opacity:0.7;
  }

  p {
    text-align: left;
    font-size:1rem;
    color: ${({theme})=>theme.palette.text.secondary};
    font-weight:bold;
  }

  ${props => props.bigger && css`
    img {
      width:70px;
      height:70px;
      opacity:0.9;
    }

    p {
      font-size:1.2rem;
    }
  `}

  ${props => props.dashedBorder && css`
    border: 2px dashed ${({theme})=> theme.palette.background.line };
    padding:15px 35px;
    border-radius:8px;

  `}

`;

export function MissingData({text='',bigger=false,dashedBorder=false}) {
  return (
    <Container bigger={bigger} dashedBorder={dashedBorder}>
      <img src='/images/open-box.png'/>
      <BreakLineText>{text}</BreakLineText>
    </Container>
  )
}
