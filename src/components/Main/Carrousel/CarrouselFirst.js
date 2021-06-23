import React from 'react';
import styled, {css} from "styled-components";

const GridCarrousel = styled.div`
  display: grid;
  grid-gap: 0px;
  z-index:1;
  overflow-x:visible;
  overflow-y:visible;
  grid-template-columns: ${props => props.sections === 2 ? '100vw 100vw' : props.sections === 3 ? '100vw 100vw 100vw' : props.sections === 4 ? '100vw 100vw 100vw 100vw': props.sections === 5 ? '100vw 100vw 100vw 100vw 100vw' : '100vw 100vw 100vw 100vw 100vw 100vw'};
  transform: ${props => `translateX(${props.position})`};
  transition: transform 1s ease;
`;

export default function Carrousel({sections=2,position=1,children}) {

    let posX = 0 ;

    if (sections % 2 === 0) {
        posX=`${((sections-1)-(position-1)*2)/(sections*2)*100}%`
    // } else if (sections % 5 === 0) {
    //   posX=`${(-1/sections)*(position-(sections+1)/2)*100}%`
    } else {
      posX=`${(-1/sections)*(position-(sections+1)/2)*100}%`
    }



/*     if (sections===2 && position===1) posX = '25%'
    else if (sections===2 && position===2) posX = '-25%'
    else if (sections===3 && position===1) posX = '33.3333333333333333333%'
    else if (sections===3 && position===2) posX = '0'
    else if (sections===3 && position===3) posX = '-33.33333333333333333%'
    else if (sections===4 && position===1) posX = '37.5%'
    else if (sections===4 && position===2) posX = '12.5%'
    else if (sections===4 && position===3) posX = '-12.5%'
    else if (sections===4 && position===4) posX = '-37.5%' */


    if (position === 0) return <>{children}</>

    return (
        <GridCarrousel sections={sections} position={posX}>
            {children}
        </GridCarrousel>
    );
}

export const PagesDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:40px 40px 0px 40px;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  border-radius:15px;
  max-width: 900px;
  margin: auto;
  background-color: ${({theme})=>theme.palette.background.paper};

  ${props => props.overflowTrue && css`
    overflow-y:auto;
    max-height:85vh;
  `}

  @media screen and (min-width: 800px) {
    min-width: 400px
  }
  @media screen and (min-width: 500px) {
    min-width: 300px
  }
  @media screen and (min-width: 1000px) {
    min-width: 600px
  }
`;

