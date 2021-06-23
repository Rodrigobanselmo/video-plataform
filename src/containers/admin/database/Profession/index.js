import React, {useState,useEffect} from 'react'
// import Modal from './Modal'
import Header from '../../../../components/Dashboard/Components/Blocks/Header'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
import {Container,TableContainer} from './comp'


const initialData = [
  { name: 'Educador Físico',activities:['Opção 1 Educador Físico','Opção 2 Educador Físico']},
  { name: 'Enfereiro',activities:['Opção 1 Enfereiro','Opção 2 Enfereiro']},
  { name: 'Farmacêutico',activities:['Opção 1 Farmacêutico' ,'Opção 2 Farmacêutico']},
  { name: 'Fisoterapeuta',activities:['Opção 1 Fisoterapeuta','Opção 2 Fisoterapeuta']},
  { name: 'Fonoaudiólogo',activities:['Opção 1 Fonoaudiólogo','Opção 2 Fonoaudiólogo']},
  { name: 'Médico',inputs:['CRM'],activities:['Opção 1 Médico','Opção 2 Médico']},
  { name: 'Naturopata',activities:['Opção 1 Naturopata','Opção 2 Naturopata']},
  { name: 'Nutricionista',activities:['Opção 1 Nutricionista','Opção 2 Nutricionista']},
  { name: 'Psicólogo',activities:['Opção 1 Psicólogo','Opção 2 Psicólogo' ]},
  { name: 'Psicopedagogo',activities:['Opção 1 Psicopedagogo','Opção 2 Psicopedagogo']},
]

function Team() {

  const [open, setOpen] = useState(false)
  const [usersRows, setUsersRows] = useState([...initialData])
  const [selected, setSelected] = useState([]);

  const {currentUser} = useAuth()
  const {setLoad} = useLoaderScreen();
  const notification = useNotification()
  const { setLoaderDash } = useLoaderDashboard();

    return (
        <>
            <Header icons={'Admin'} title={'Profissões e suas atividades'} video={true}/>
            <Container >
                <TableContainer
                  setLoaderDash={setLoaderDash}
                  setLoad={setLoad}
                  tabsLabel={['Profissões e atividades']}
                  currentUser={currentUser}
                  notification={notification}
                  setDataRows={setUsersRows}
                  dataRows={usersRows}
                  setSelected={setSelected}
                  selected={selected}
                  setOpen={setOpen}
                />
            </Container>
            {/* <Modal setUsersRows={setUsersRows} open={open} setOpen={setOpen}/> */}
        </>
    )
}

export default Team
