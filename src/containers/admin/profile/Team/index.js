import React, {useState,useEffect} from 'react'
// import Header from '../../../../components/Dashboard/Components/Blocks/Header'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
// import {Container,TableContainer} from './comp'
import styled,{css} from "styled-components";
import { MembersTable } from '../../../../components/Main/Tables/Members'
import {FilterComponent,LoadingContent,AddUserButton} from '../../../../components/Main/Table/comp'
import { Add, HdrStrongOutlined } from '@material-ui/icons'
import { LoadMoreTableCells } from '../../../../components/Main/Tables/elements/LoadMore'
import { AddMemberModal } from '../../../../components/Modal/Pages/AddMember'
import { useUsers } from '../../../../services/hooks/get/useUsers';
import { useLinks } from '../../../../services/hooks/get/useLinks';
import { LinksURLTable } from '../../../../components/Main/Tables/LinksURL';
import { CardButton } from '../../../../components/Blocks/CardButton';
import { useCursos } from '../../../../services/hooks/get/useCursos';
import { Container,Title,IconButtonStyled,AddCard } from './styles';

function Team() {

  const  { data, isLoading, error } = useUsers({notDisableLoad:true})
  const  { dataCursos, isLoadingCursos } = useCursos({notDisableLoad:true})
  // const  { data:links, isLoading:linksIsLoading, error:linksError } = useLinks(3)

  const [open, setOpen] = useState(false)
  const [queryOld, setQueryOld] = useState(false)
  const [usersRows, setUsersRows] = useState([])
  const [selected, setSelected] = useState([]);

  const {currentUser} = useAuth()
  const {setLoad} = useLoaderScreen();
  const notification = useNotification()
  const query = new URLSearchParams(useLocation().search)
  const { setLoaderDash } = useLoaderDashboard();

  useEffect(() => {
    if (query.get('m') !== queryOld && query.get('m')) setOpen(true); setQueryOld(query.get('m'))
  }, [query])

  useEffect(() => {
    if (!isLoading && !isLoadingCursos) setLoaderDash(false)
}, [isLoading,isLoadingCursos])

  function onAddMember() {
    console.log(2)
    setOpen(true)
  }

    return (
      <>
        <Title >Gerenciar Membros</Title>
        <div style={{flex:1,display:'flex', flexDirection:'row',gap:30,marginBottom:40,/* padding:'3px 0',overflowX:'auto',overflowY:'visible' */}}>
          <CardButton
            onClick={onAddMember}
            image={'/images/email.png'}
            title={'Adicionar Membros'}
            text={'Click aqui para adicinar // novos membro e alunos a sua // equipe.'}
            alt='E-mail letter'
          />
          <CardButton
            onClick={()=>{}}
            image={'/images/aprendizagem-online.png'}
            title={'Disponibilizar Cursos'}
            text={'Click aqui para adicinar cursos // a membros já cadastrados // em sua equipe.'}
            alt='Laptop'
          />
        </div>

        {/* <AddCard onClick={onAddMember}>
          <img style={{width:60,height:60,marginRight:'10px',padding:'10px 5px'}} src='/images/email.png'/>
          Click aqui para adicinar novos  membro e alunos a sua equipe.
          <IconButtonStyled id='IconButtonStyled'>
            <Add style={{}}/>
          </IconButtonStyled>
        </AddCard> */}
        <LinksURLTable data={data?data:[]} filter={false} isLoading={isLoading}/>
        <MembersTable data={data?data:[]} isLoading={isLoading}/>

        <AddMemberModal setUsersRows={setUsersRows} open={open} setOpen={setOpen}/>
      </>
    )
}

export default Team

  //               <TableContainer
  //                 setLoaderDash={setLoaderDash}
  //                 setLoad={setLoad}
  //                 tabsLabel={['Seus Usuários']}
  //                 currentUser={currentUser}
  //                 notification={notification}
  //                 setDataRows={setUsersRows}
  //                 dataRows={usersRows}
  //                 setSelected={setSelected}
  //                 selected={selected}
  //                 setOpen={setOpen}
  //               />
