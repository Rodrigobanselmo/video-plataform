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
import IconButton from '@material-ui/core/IconButton';
import { LoadMoreTableCells } from '../../../../components/Main/Tables/elements/LoadMore'
import { AddMemberModal } from '../../../../components/Modal/Pages/AddMember'
import { useUsers } from '../../../../services/hooks/get/useUsers';
import { useLinks } from '../../../../services/hooks/get/useLinks';
import { LinksURLTable } from '../../../../components/Main/Tables/LinksURL';

const VisualizeMore = styled.p`
  text-align: right;
  padding-top: 10px;
  display:block;
  width: fit-content;
  margin-left: auto;
  cursor:pointer;

  &:hover {
    opacity:0.6;
  }
  &:active {
    opacity:0.4;
  }
`;


const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 1rem;

  &.bottom {
    margin-bottom: 10px;
  }
`;


const IconButtonStyled = styled(IconButton)`
  margin-left: 8;
`;


const AddCard = styled.div`
  padding: 10px 20px 10px 20px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 40px;
  /* border: 1px solid #aaa; */
  border-radius: 7px;
  width:300px;
  height: fit-content;
  border-left: 5px solid ${({theme})=> theme.palette.status.successD};
  -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.23);
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.23);
  cursor:pointer;

  &:hover {
    opacity:0.8;
  }

  &:active {
    opacity:1;
  }

  &:hover ${IconButtonStyled} {
    background-color: rgba(0,0,0,0.05);
  }

`;



function Team() {

  const  { data:users, isLoading:usersIsLoading, error:usersError } = useUsers(5)
  const  { data:links, isLoading:linksIsLoading, error:linksError } = useLinks(3)

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

  function onAddMember() {
    console.log(2)
    setOpen(true)
  }

    return (
      <>
        <Title >Gerenciar Membros</Title>
        <div  onClick={onAddMember} style={{flex:1,display:'flex', cursor:'pointer', flexDirection:'row',gap:30,width:'100%',marginBottom:40}}>
          <div style={{boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.13)',padding:10,marginRight:10,display:'flex',backgroundColor:'white',flexDirection:'column',width:240,borderRadius:'10px',height:210,alignItems: 'center',textAlign:'center',justifyContent: 'center'}}>
            <img style={{width:60,marginBottom:5,height:60,padding:'0px 0px'}} src='/images/email.png'/>
            <p style={{marginBottom:5,fontSize:'15px'}}><strong>Adicionar Membros</strong></p>
            <p style={{fontSize:'14px',color:'grey'}}>Click aqui para adicinar <br/> novos  membro e alunos a sua equipe.</p>
          </div>
          <div style={{boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.13)',marginRight:10,display:'flex',backgroundColor:'white',flexDirection:'column',width:240,borderRadius:'10px',height:210,alignItems: 'center',textAlign:'center',justifyContent: 'center'}}>
            <img style={{width:60,marginBottom:5,height:60,padding:'0px 0px'}} src='/images/aprendizagem-online.png'/>
            <p style={{marginBottom:5,fontSize:'15px'}}><strong>Disponibilizar Cursos</strong></p>
            <p style={{fontSize:'14px',color:'grey'}}>Click aqui para adicinar cursos a membros já cadastrados a sua equipe.</p>
          </div>
        </div>

        {/* <AddCard onClick={onAddMember}>
          <img style={{width:60,height:60,marginRight:'10px',padding:'10px 5px'}} src='/images/email.png'/>
          Click aqui para adicinar novos  membro e alunos a sua equipe.
          <IconButtonStyled id='IconButtonStyled'>
            <Add style={{}}/>
          </IconButtonStyled>
        </AddCard> */}
        <LinksURLTable filter={false} data={links} isLoading={linksIsLoading}/>
        <MembersTable data={users} isLoading={usersIsLoading}/>

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
