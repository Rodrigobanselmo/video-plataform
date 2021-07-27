import React, {useState,useEffect} from 'react'
// import Header from '../../../../components/Dashboard/Components/Blocks/Header'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
// import {Container,TableContainer} from './comp'
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
import { ReactSelect } from '../../../../components/Forms/components/ReactSelect';
import { InputNew } from '../../../../components/Forms/components/Input';
import { InputSearch } from '../../../../components/Forms/components/InputSearch';
import { filterObject } from '../../../../helpers/ObjectArray';
import styled, { css } from 'styled-components';
import { fade, darken } from '@material-ui/core/styles';

const Item = styled.button`
  display: grid;
  position: relative;
  border: none;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 100%;
  align-items: center;
  grid-template-columns: 1.2fr 1fr 1fr;
  padding: 0.8rem 1.25rem;
  cursor: pointer;

  p {
    text-align: left;
    font-size: 0.9rem;
  }

  &:after {
    position: absolute;
    content: '';
    bottom: 0px;
    left: 1.25rem;
    width: calc(100% - 2.5rem);
    height: 1px;
    background-color: ${({ theme }) => theme.palette.background.line};
  }

  &:hover {
    background-color: ${({ theme }) => fade(theme.palette.primary.main, 0.1)};
  }
`;

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
    setOpen(true)
  }

    const filter = (data,search) => {
      const searchParams = ['name', 'cpf','email']
      const newData = []
      data.map((row)=>{
        if(searchParams[0] && filterObject(row,search,searchParams[0])) newData.push({...row})
        else if (searchParams[1] && filterObject(row,search,searchParams[1])) newData.push({...row})
        else if (searchParams[2] && filterObject(row,search,searchParams[2])) newData.push({...row})
      })
      return newData
    }

    function handleSelect(e) {
      // console.log(e)
    }


    return (
      <>
        {/* <ReactSelect/>
        <InputSearch
          filter={filter}
          onSelect={handleSelect}
          row={({item, onHandleSelect})=>(
            <Item onClick={() => onHandleSelect(item)}>
              <p>{item.name}</p>
              <p>{item.email}</p>
              <p>
                {item?.cpf ? item.cpf : '---------------------------'}
              </p>
            </Item>
          )}
          name={'selects'}
          label='Selecione Membros'
          options={data?data.filter(i=>i?.name&&i?.email):[]}
        >

        </InputSearch> */}
        <InputNew
          name={'select'}
          label='Selecione Membros'
        />
        <Title >Gerenciar Membros</Title>
        <div style={{flex:1,display:'flex', flexDirection:'row',gap:30,marginBottom:40,/* padding:'3px 0',overflowX:'auto',overflowY:'visible' */}}>
          <CardButton
            onClick={()=>setOpen(true)}
            image={'/images/email.png'}
            title={'Adicionar Membros'}
            text={'Click aqui para adicinar // novos membro e alunos a sua // equipe.'}
            alt='E-mail letter'
          />
          <CardButton
            onClick={()=>setOpen('update')}
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

        <AddMemberModal setUsersRows={setUsersRows} open={!!open} setOpen={setOpen} update={open==='update'}/>
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
