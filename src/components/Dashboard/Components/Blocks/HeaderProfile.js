import React from 'react'
import styled from "styled-components";
import {Icons} from '../../../Icons/iconsDashboard'
import {ModalFullScreen} from '../../../Main/MuiHelpers/Modal'
import { lighten,darken,fade } from "@material-ui/core/styles";
import { FiCamera } from 'react-icons/fi';

const GroupIcon = styled(Icons)`
  font-size:50px;
  //color:${({theme})=>theme.palette.primary.main};
  color:${({theme})=>theme.palette.text.primary};
`;

const GroupIconVideo = styled(Icons)`
  font-size:50px;
  color:${({theme})=>theme.palette.text.primary};
  font-size:26px;
  margin-bottom:-3px;
  cursor: pointer;
`;


const Image = styled.img`
  height: 70px;
  background-color: ${({theme})=>theme.palette.type !=='dark' ? theme.palette.background.paper :theme.palette.background.contrast};
  width: 70px;
  margin-right: 18px;
  border-radius: 8px;
  display:flex;
  align-items:center;
  justify-content:center;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
`;

const Title = styled.h1`
  margin: 0;
  font-size:30px;
  display: inline-block;
  margin-right: 18px;
  /* text-shadow: 1px 1px 1px #CE5937; */
`;


const Header = styled.div`
  color: ${({theme})=>theme.palette.text.primary};
  margin: 0px 0px 20px 0px;
  display:flex;
  flex-direction:row;
  align-items:center;
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  margin-right: 20px;
  position: relative;
  align-self: center;
  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
  }
  div {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    background: ${({theme})=>fade(theme.palette.primary.mainLight,0.4)};
    border: 2px solid ${({theme})=>(theme.palette.text.third)};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: ${({theme})=>(theme.palette.primary.main)};
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({theme})=>(theme.palette.primary.contrastText)};
    }
    &:hover {
      background: ${({theme})=>fade(theme.palette.primary.main,0.8)};
    }
  }
`;

const HeaderComponent = React.memo(({icons,photo,handleAvatarChange, title,path,subTitle}) => {

    return (
        <Header >
            <AvatarInput>
              {!photo ?
                <div>
                  <Icons style={{fontSize:140}} type={`Avatar`}/>
                </div>
              :
                <img src={photo} alt={'perfil_photo'} />
              }
              <label htmlFor="avatar">
                <FiCamera />
                <input accept="image/*" type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>
            <div >
              <div style={{marginRight:10, flexDirection:'row'}}>
                <Title >{title}</Title>
              </div>
            <p>{subTitle}</p>
            </div>
        </Header>

    )
});

export default HeaderComponent
