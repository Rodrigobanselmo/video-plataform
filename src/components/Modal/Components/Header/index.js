import React from 'react'
import styled from "styled-components";

export const HeaderPage = styled.div`
    display:flex;
    flex-direction:column;
    align-items:${({center})=>center?'center':'flex-start'};;
    margin-bottom:30px;
`;

export const Title = styled.h1`
    font-size:25px;
    color: ${({theme})=> theme.palette.text.primary };
    margin-bottom:0px;
`;


export const SubTitle = styled.p`
    text-align:left;
    margin-top:10px;
    font-size:16px;
    color: ${({theme})=> theme.palette.text.primary };
`;

export function HeaderModal(props) {
  return(
    <HeaderPage center={props.center} >
        <Title>{props.text}</Title>
        {props.subText && <SubTitle>{props.subText}</SubTitle>}
    </HeaderPage>

  )
}
