import React, {useContext} from 'react';
import {Icons} from '../../../../components/Icons/iconsDashboard';
import {
  ContainerDiv,
  ButtonContainer
} from './styles';
import NewTabs, {TabPanel} from '../../../../components/Main/MuiHelpers/NewTabs'
import {FilterComponent,LoadingContent,AddUserButton} from '../../../../components/Main/Table/comp'
import {onGetAllUsersCompany} from './func'
import {Link} from "react-router-dom";
import {keepOnlyNumbers} from '../../../../helpers/StringHandle';
import { ADMIN_PERFIL } from '../../../../routes/routesNames';
import {useHistory} from "react-router-dom";
import TableComponent from './table.js';

export function Container({children}) {
    return (
      <ContainerDiv >
        {children}
      </ContainerDiv>
    );
}


export function TableContainer({setSelected,selected,dataRows,setDataRows,tabsLabel,setOpen,currentUser,notification,setLoad,setLoaderDash}) {

  const [loadContent, setLoadContent] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [tabValue, setTabValue] = React.useState(0);
  const history = useHistory();

  React.useEffect(() => {
    onGetAllUsersCompany(currentUser,setDataRows,setLoadContent,notification,setLoaderDash)
  }, [])

  function handleCellClick(e,rowId,item) {
    setLoaderDash(true)
    if (currentUser.uid == rowId) return history.push(ADMIN_PERFIL);
    if (item.status == 'Aguardando Autenticação') return history.push(`${ADMIN_PERFIL}/${item.email}`);
    history.push(`${ADMIN_PERFIL}/${rowId}`);
  }

  return (
    <NewTabs tabValue={tabValue} setTabValue={setTabValue} tabsLabel={tabsLabel} >
      <div style={{paddingRight:27,paddingLeft:27}}>
        <FilterComponent
          // style={{marginLeft:-12}}
          setLoadContent={setLoadContent}
          setSearch={setSearch}
          search={search}
          onCleanSearch={()=>setSearch('')}
        >
          <AddUserButton onClick={()=>setOpen(true)}/>
          <div style={{flex:1}}/>
          {/* {selected.length == 1 &&
          <Link style={{textDecoration: 'none', }} to={`${COMPANY}/${keepOnlyNumbers(selected[0])}/0`}>
            <AddUserButton text={'Editar'} icon={'Edit'} width={100} />
          </Link>
          } */}
          {/* <Container.AddUserButton text={'Desativar'} icon={'Archive'} width={140} onClick={()=>setOpen(true)}/> */}
          {/* <Container.AddUserButton text={'Ativar'} icon={'Unarchive'} width={120} onClick={()=>setOpen(true)}/> */}
        </FilterComponent>
      { loadContent ?
          <LoadingContent />
        :
          <TabPanel key={0} value={tabValue} index={0} >
            <TableComponent
              rowsCells={dataRows}
              selected={selected}
              setSelected={setSelected}
              loadContent={loadContent}
              search={search}
              handleCellClick={handleCellClick}
            />
          </TabPanel>
      }
      </div>
    </NewTabs>
  );
}



