import React, {useState,useEffect} from 'react'
// import Modal from './Modal'
import HeaderProfile from '../../../../components/Dashboard/Components/Blocks/HeaderProfile'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation,useParams } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
import {Container,TableContainer,Form} from './comp'
import {onAddUserData,onUpdateProfile,onGetUser} from './func'

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
    // if (query.get('m') !== queryOld && query.get('m')) setOpen(true); setQueryOld(query.get('m'))
    if (isOtherUser) {
      onGetUser({uid:userId,setData:setUser,notification,setLoaderDash})
    } else {
      setUser({email:true})
      setTimeout(() => {
        setLoaderDash(false)
      }, 1000);
    }
  }, []) //query,

  const handleAvatarChange = React.useCallback(
    (event) => {
      // if (isOtherUser) notification.error({message:'Você não é capaz',modal:false})
      if (isOtherUser && event.target.files && event.target.files[0]) {
        notification.error({message:'Somente o usuário responsavel pela conta é permitido editar a foto de perfil',modal:false})
        // onUpdateProfile({image:event.target.files[0],currentUser:user,setCurrentUser:setUser,setLoad,notification})
      } else if (event.target.files && event.target.files[0]) {
        onUpdateProfile({image:event.target.files[0],currentUser,setCurrentUser,setLoad,notification})
      }
    },
    [userId],
  );
    if (!user?.email) return <></>
    return (
        <>
            <HeaderProfile photo={isOtherUser?user?.photoURL:currentUser?.photoURL} handleAvatarChange={handleAvatarChange} currentUser={isOtherUser?user:currentUser} subTitle={isOtherUser?user?.email:currentUser?.email} title={isOtherUser?user?.name:currentUser?.name}/>
            {/* <div style={{backgroundColor:'black',display:'flex',width:'100%',flexDirection:'row'}}>
              <div style={{backgroundColor:'white',display:'flex',flex:9,width:'100%',height:350,marginRight:20}}>
              </div>
              <div style={{backgroundColor:'white',flex:5,display:'flex',width:'100%',height:650}}>
              </div>
            </div> */}
            <Container >
                <Form
                  setCurrentUser={isOtherUser?setUser:setCurrentUser}
                  setLoad={setLoad}
                  currentUser={isOtherUser?user:currentUser}
                  notification={notification}
                  userId={userId}
                />
                {/* <TableContainer
                  setLoaderDash={setLoaderDash}
                  setLoad={setLoad}
                  tabsLabel={['Profissões e atividades']}
                  currentUser={currentUser}
                  notification={notification}
                  setOpen={setOpen}
                /> */}
            </Container>
            {/* <Modal setUsersRows={setUsersRows} open={open} setOpen={setOpen}/> */}
        </>
    )
}

export default Team
