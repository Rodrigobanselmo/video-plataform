import React from 'react'
import styled,{css} from "styled-components";
import Skeleton from '@material-ui/lab/Skeleton';

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
`;

export function MissingData({text}) {
  return (
    <Container>
      <img src='/images/open-box.png'/>
      {text}
    </Container>
  )
}
