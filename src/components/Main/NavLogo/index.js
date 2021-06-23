import React from 'react';
import { NavLogoSC,NavLogoSCDiv } from './Logo';
import styled from "styled-components";
import { useSelector,useDispatch } from 'react-redux'

const Images = styled.img`
  height:30px;
  resize:cover;
`;

export const NavLogo = React.memo(({isOpen,...props}) => {

  const dispatch = useDispatch()
  return (
    <NavLogoSCDiv   {...props} onClick={()=>{}} >
          re<span style={{color:isOpen?'#000':'#000'}}>conecta</span>
    </NavLogoSCDiv>
  );
})
