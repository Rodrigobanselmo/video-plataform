import React, {useState,useEffect} from 'react'
// import Modal from './Modal'
import HeaderProfile from '../../../../components/Dashboard/Components/Blocks/HeaderProfile'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation,useParams } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'

// const initialData = [
//   { name: 'Educador Físico',activities:['Opção 1 Educador Físico','Opção 2 Educador Físico']},
//   { name: 'Enfereiro',activities:['Opção 1 Enfereiro','Opção 2 Enfereiro']},
//   { name: 'Farmacêutico',activities:['Opção 1 Farmacêutico' ,'Opção 2 Farmacêutico']},
//   { name: 'Fisoterapeuta',activities:['Opção 1 Fisoterapeuta','Opção 2 Fisoterapeuta']},
//   { name: 'Fonoaudiólogo',activities:['Opção 1 Fonoaudiólogo','Opção 2 Fonoaudiólogo']},
//   { name: 'Médico',inputs:['CRM'],activities:['Opção 1 Médico','Opção 2 Médico']},
//   { name: 'Naturopata',activities:['Opção 1 Naturopata','Opção 2 Naturopata']},
//   { name: 'Nutricionista',activities:['Opção 1 Nutricionista','Opção 2 Nutricionista']},
//   { name: 'Psicólogo',activities:['Opção 1 Psicólogo','Opção 2 Psicólogo' ]},
//   { name: 'Psicopedagogo',activities:['Opção 1 Psicopedagogo','Opção 2 Psicopedagogo']},
// ]

function Team() {

  const {currentUser,setCurrentUser} = useAuth()
  const [user, setUser] = useState(false)
  const [queryOld, setQueryOld] = useState(false)

  const {setLoad} = useLoaderScreen();
  const notification = useNotification()
  // const query = new URLSearchParams(useLocation().search)
  const { setLoaderDash } = useLoaderDashboard();

  let { userId } = useParams();

  const isOtherUser = userId && currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('ea')

  useEffect(() => {
  }, []) //query,

  // const handleAvatarChange = React.useCallback(
  //   (event) => {
  //     // if (isOtherUser) notification.error({message:'Você não é capaz',modal:false})
  //     if (isOtherUser && event.target.files && event.target.files[0]) {
  //       notification.error({message:'Somente o usuário responsavel pela conta é permitido editar a foto de perfil',modal:false})
  //       // onUpdateProfile({image:event.target.files[0],currentUser:user,setCurrentUser:setUser,setLoad,notification})
  //     } else if (event.target.files && event.target.files[0]) {
  //       onUpdateProfile({image:event.target.files[0],currentUser,setCurrentUser,setLoad,notification})
  //     }
  //   },
  //   [userId],
  // );
    if (!user?.email) return <></>
    return (
        <>

        </>
    )
}

export default Team
