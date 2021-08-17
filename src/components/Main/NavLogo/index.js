import React from 'react';
import { NavLogoSC,NavLogoSCDiv } from './Logo';
import styled from "styled-components";
import { useSelector,useDispatch } from 'react-redux'

const Images = styled.img`
  height:30px;
  resize:cover;
  @media screen and (max-width: 900px) {
    /* height:25px; */
    display:none;
  }

`;
const ImageIcon = styled.img`

    display:none;
  @media screen and (max-width: 900px) {
    display:block;
    resize:cover;
    height:30px;
  }

`;

export const NavLogo = React.memo(({isOpen,...props}) => {

  const dispatch = useDispatch()
  return (
    <NavLogoSCDiv   {...props} onClick={()=>{}} >
          {/* re<span style={{color:isOpen?'#000':'#000'}}>conecta</span> */}
      <Images src="/images/logoRealiza.png" alt="logo" />
      <ImageIcon src="/images/iconRealiza.png" alt="logo" />
    </NavLogoSCDiv>
  );
})
