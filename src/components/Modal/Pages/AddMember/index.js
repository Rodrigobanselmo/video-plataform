import React, {useState, useEffect,useMemo} from 'react';
// import AddModal, {Type,Form} from './comp'
import {userTypes,headCells,rows} from '../../../../constants/userTypes'
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useAuth } from '../../../../context/AuthContext'
import Carrousel, {PagesDiv} from '../../../Main/Carrousel/CarrouselFirst'
import {onCreatePendingUser,onCheckUser} from './func'
import { useSelector,useDispatch } from 'react-redux'
import { ModalFullScreen } from '../../ModalFullScreen';
import styled from "styled-components";
import { HeaderModal } from '../../Components/Header';
import { AddUserData } from '../../../Forms/AddUserData';
import { SideEmail } from './Side';
import { useQuery } from 'react-query';
import { db } from '../../../../lib/firebase.prod';
import { useCreateUsers } from '../../../../services/hooks/set/useCreateUsers';


const InputsEmail = styled.div`
  padding:40px 40px 0px 40px;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  border-radius:15px;
  background-color: ${({theme})=>theme.palette.background.paper};
  overflow-y:auto;
  max-height:85vh;
`;


export const Container = styled.div`
    display:flex;
    z-index:1;
    flex-direction:column;
    overflow-x:hidden;
    justify-content:center;
    align-items:center;
    padding:50px 10vw 20px 10vw;
    min-height: 100vh;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1.5fr;
  gap: 50px;
  width:100%;
  max-width: 1200px;
  margin: auto 40px;
  align-self: center;
  justify-self: center;
  flex-direction:column;
  max-height:85vh;


  @media screen and (min-width: 500px) {
    min-width: 300px
  }
  @media screen and (min-width: 800px) {
    min-width: 400px
  }
  @media screen and (min-width: 1000px) {
    min-width: 800px
  }
`;

export function AddMemberModal({open,setOpen,setUsersRows}) {

  const {currentUser} = useAuth();
  const mutation = useCreateUsers()



  const [numInput, setNumInput] = useState(3) //numeros de inputs
  const [eieo, setEmails] = useState([{email:'',status:'',message:'',type:''}]) //dados dos email inseridos nos inputs
  const [email, setEmail] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
  const [unform, setUnform] = useState({}) //dados dos email inseridos nos inputs
  const [infoModal, setInfoModal] = useState({title:'',text:''}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
  const [position, setPosition] = useState(1) //posicao do carrousel


  const {setLoad} = useLoaderScreen();
  const notification = useNotification();
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)

  const [dataUser, setDataUser] = useState({}) //dados dos email inseridos nos inputs
  const [cursosSelected, setCursosSelected] = useState({});

  function onClose() {
      if (mutation.isLoading) return

      setOpen(false)
      setCursosSelected({})
      setDataUser({})
      setEmail({value:'',index:null})
      // setPosition(1)
  }

  function onGoBack() {
  //   if (position == 2) setInfoModal({title:'',text:''})
  //   else if (position == 3 && save) return notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim, os dados inseridos serão perdidos?',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
  //     setPosition(position=>position-1)
  //     dispatch({ type: 'SAVE', payload: false })
  //   }})
  //   setPosition(position=>position-1)
  }


  return (
    <ModalFullScreen open={open} onClose={onClose} infoModal={infoModal} onGoBack={onGoBack}>
      <Container>
          <GridContainer>

            <InputsEmail>
              <HeaderModal
                center
                text='Adicionar Novos Alunos a Plataforma'
                subText='Você poderá disponibilizar cursos e convidar novos alunos a plataforma.'
                />
              <AddUserData
                cursos={cursosSelected}
                setCursos={setCursosSelected}
                setEmail={setEmail}
                setData={setDataUser}
                data={dataUser}
                mutation={mutation}
                onClose={onClose}
              />
            </InputsEmail>

            <SideEmail
              setData={setDataUser}
              data={dataUser}
              setCursos={setCursosSelected}
              cursos={cursosSelected}
              email={email}
            />

          </GridContainer>
        </Container>
      </ModalFullScreen>
  );
}
