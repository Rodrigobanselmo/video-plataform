import React from 'react';
import { formatCPFeCNPJeCEPeCNAE } from '../../../../helpers/StringHandle';
import styled from "styled-components";
import { FaUserTie } from 'react-icons/fa';
import { ButtonForm } from '../../../Dashboard/Components/Form/comp';

const Container = styled.div`
  display:grid;
  grid-template-columns: 1fr fit-content;
  align-items: flex-end;

  div:nth-child(3)  {
    margin-top:20px;
  }
`;


const AvatarInput = styled.div`
  position: relative;
  align-self: center;
  color: ${({ theme }) => theme.palette.text.third};
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  div {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: ${({theme})=>theme.palette.background.default};
    background-color: #fff;
    /* border: 2px solid ${({theme})=>(theme.palette.text.forth)}; */
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.16);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  margin-bottom:20px;
  grid-column:1 / 3;
`;

const Label = styled.h1`
  font-size:0.9rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom:0.25rem;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size:1rem;
  padding:0.55rem 0.8rem;
  border: 1px solid ${({theme})=> theme.palette.background.line };
  background-color: ${({theme})=>theme.palette.background.paper};
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.13);
  border-radius: 5px;
`;

export function ProfilePrimaryUserData({user, setCurrentUser}) {

  const data = [
    {type:'name', label:"Nome",},
    {type:'email', label:"E-mail",},
    {type:'cpf', label:"CPF",},
    {type:'cell', label:"Celular",},
  ]


  return (
    <Container>
      <AvatarInput >
        {user?.photoURL ?
          <img  src={user.photoURL} alt={'perfil_photo'} />
        :
          <div >
            <FaUserTie style={{fontSize:110,transform:'translateY(-5px)'}} />
          </div>
        }
      </AvatarInput>
      <ButtonForm
        primary="true"
        style={{ width: 'fit-content'}}
        onClick={()=>setCurrentUser(data=> ( {...data, initialized:false} ))}
      >
        Editar
      </ButtonForm>
      {data.map(item=>{
        return (
          <Wrapper key={item.type}>
            <Label>{item.label}</Label>
            <Text>{item.type == 'cpf' ? formatCPFeCNPJeCEPeCNAE(user[item.type]) : user[item.type]}</Text>
          </Wrapper>
        )
      })}

    </Container>
  );
}
