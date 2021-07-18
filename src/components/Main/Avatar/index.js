import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import styled, {css} from "styled-components";
import { InitialsName } from '../../../helpers/StringHandle';
import { darken } from '@material-ui/core';

const ProfileImage = styled.div`
  height: 56px;
  width: 56px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-shrink: 0;

  background-image: url(${({photoURL})=>photoURL});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
`;


const ProfileName = styled.p`
  font-size: 22px;
  font-weight:600;
  /* letter-spacing:2px; */
  /* padding-top: 3px; */
  padding-left: 1px;
  color: ${({theme})=>theme.palette.primary.contrastText};

  ${props => props.navbar && css`
    letter-spacing: 0px;
    padding-top: 0px;
    padding-left: 0px;
    font-size:18px;
  `}

  ${props => props.borderApplied && css`
    letter-spacing: 0px;
    padding-top: 0px;
    padding-left: 0px;
    font-size: 20px;
  `}
`;


const Profile = styled.div`
  background-color: ${({theme})=>theme.palette.primary.main};
  display:flex;
  flex:1;
  border-radius: 40px;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  flex-shrink: 0;



`;


const ProfileContainer = styled.div`
  display: flex;
  margin:5px 0;
  height: 55px;
  width: 55px;
  border-radius: 30px;
  flex-shrink: 0;
  box-sizing: border-box;
  cursor: pointer;
  transform: scale(0.9);
  background-color: transparent;

  ${props => props.navbar && css`
    margin:0;
    margin-left:15px;
    height:53px;
    width: 53px;
    padding:2px;
    border: 2px solid ${({theme})=> theme.palette.text.primaryNav };
  `}

  ${props => props.borderApplied && css`
    height:55px;
    width: 55px;
    padding:2px;
    border: 2px solid ${({theme})=> theme.palette.text.primaryNav };
  `}
`;

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


export function AvatarView({user, navbar, borderApplied, forwardRef, ...props}) {

  const isPhoto = user?.photoURL;
  const isPending = user?.status && (user.status === 'Pendente' || user.status === 'Autenticando');

  return (
    <ProfileContainer ref={forwardRef} borderApplied={borderApplied && !(!isPhoto && isPending)} navbar={navbar} {...props}>
    {!isPhoto && !isPending ? (
      <Profile style={navbar?{}:{backgroundColor:darken(stringToColor(user?.name??'Rp'),0.06)}}>
        <ProfileName borderApplied={borderApplied} navbar={navbar}>
          {user?.name ? InitialsName(user.name,22) : 'PE'}
        </ProfileName>
      </Profile>
    ) : ( !isPhoto && isPending
      ? <ProfileImage style={{borderRadius:0,opacity:0.9}} photoURL={'/images/pendente.png'}/>
      : <ProfileImage photoURL={user.photoURL}/>
    )}
  </ProfileContainer>
  );
}
