import React, {useContext,useState} from 'react';
import {Icons} from '../../../../components/Icons/iconsDashboard';
import {
  ContainerDiv,
  ButtonContainer
} from './styles';
import NewTabs, {TabPanel} from '../../../../components/Main/MuiHelpers/NewTabs'
import {FilterComponent,LoadingContent,AddUserButton} from '../../../../components/Main/Table/comp'
// import {onGetAllUsersCompany} from './func'
import {Link} from "react-router-dom";
import {keepOnlyNumbers} from '../../../../helpers/StringHandle';
import {useHistory} from "react-router-dom";
import { ProfessionForm, UserForm,AddressForm, BankForm, PermissionForm } from '../Team/Modal//form'
import { useSelector,useDispatch } from 'react-redux'
import Input, {InputEnd,InputUnform,SelectedEnd} from '../../../../components/Main/MuiHelpers/Input'
import Checkbox from '@material-ui/core/Checkbox';
import {HeaderPage,Page,InputsContainer,Title,SubTitle,IconCloseFull,IconGoBackFull} from '../../../../components/Dashboard/Components/Standard/PageCarousel'
import {HeaderForm,FormContainer,SubTitleForm,TitleForm,DividerForm,AddAnotherForm,ButtonForm} from '../../../../components/Dashboard/Components/Form/comp'
import {NumberFormatCNPJ,NumberOnly,RGFormat,NumberFormatOnly,NumberFormatCEP, NumberFormatCPF,NumberFormatTel,NumberFormatCell} from '../../../../lib/textMask'
import {ModalButtons} from '../../../../components/Main/MuiHelpers/ModalButtons'
import {onEditUserData,onUpdateProfile,onGetUser} from './func'
import * as Yup from 'yup'

// import TableComponent from './table.js';

export function Container({children}) {
    return (
      <ContainerDiv >
        {children}
      </ContainerDiv>
    );
}

export function Form({setCurrentUser,notification,setLoad,currentUser,userId}) {

  const [tabValue, setTabValue] = React.useState(0);
  const tabsLabel = currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('ea') ?['Dados Pessoais','Dados de Endereço','Dados Bancário','Dados Profissionais','Permissões']:['Dados Pessoais','Dados de Endereço','Dados Bancário','Dados Profissionais']
  const [banks, setBanks] = useState([])
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)
  // const [unform, setTabValue] = React.useState(0);

  const onSaveUser = (unformData) => {
    // console.log(unformData,'unformData')
    // unformData?.professions&&unformData.professions.map(item=>{
    //   if ( )return
    // })
    // console.log(10)
    onEditUserData({isEmail:userId&&userId.includes('@'),currentUser:{...currentUser,...unformData},dispatch,setCurrentUser,setLoad,notification})
    //vk5ngaeZY4Vy0TreQIzyNtd1Zrw1
  }

  const onTabChange = (value) => {
    if (save) notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim? Os dados inseridos serão perdidos.',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
      dispatch({ type: 'SAVE', payload: false })
      setTabValue(value)
    }})
    else setTabValue(value)
  }

  return(
    <NewTabs tabStayle={{minWidth: 120}} tabValue={tabValue} onChange={onTabChange} tabsLabel={tabsLabel} >
      <TabPanel key={0} value={tabValue} index={0} >
        {/* <HeaderPage style={{margin:'10px 0px'}}>
          <Title style={{fontSize:18}}>Dados de Endereço</Title>
        </HeaderPage> */}
        <UserForm notification={notification} unform={currentUser} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={1} value={tabValue} index={1} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <AddressForm notification={notification} unform={currentUser?.address?currentUser.address:{}} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={2} value={tabValue} index={2} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <BankForm banks={banks} setBanks={setBanks} notification={notification} unform={currentUser?.bankAccount?currentUser.bankAccount:{}} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      <TabPanel key={3} value={tabValue} index={3} >
        {/* <AddModal.Header
          text='Dados de Endereço'
          subText='Informe seu endereço para prosseguir'
        /> */}
        <HeaderPage style={{margin:'20px 0px'}}>
          <p style={{fontSize:18}}>Selecione as profissões e as areas de atuação.</p>
        </HeaderPage>
        <ProfessionForm notification={notification} unform={currentUser} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      {currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('ea') &&
        <TabPanel key={4} value={tabValue} index={4} >
        <HeaderPage style={{margin:'20px 0px'}}>
          <p style={{fontSize:18}}>Selecione as permissões de usuário.</p>
        </HeaderPage>
        <PermissionForm notification={notification} unform={currentUser} onForm={onSaveUser} dispatch={dispatch} save={save}/>
      </TabPanel>
      }
    </NewTabs>
  )
}

export function TableContainer({setSelected,selected,dataRows,setDataRows,tabsLabel,setOpen,currentUser,notification,setLoad,setLoaderDash}) {

  const [loadContent, setLoadContent] = React.useState(false) //true
  const [search, setSearch] = React.useState('')
  const [tabValue, setTabValue] = React.useState(0);
  const history = useHistory();

  React.useEffect(() => {
    setLoaderDash(false)
    // onGetAllUsersCompany(currentUser,setDataRows,setLoadContent,notification,setLoaderDash)
  }, [])

  function handleCellClick(e,rowId) {
    //history.push(`${COMPANY}/${keepOnlyNumbers(rowId)}/0`);
    //setLoaderDash(true)
  }

  return (
    <NewTabs tabValue={tabValue} setTabValue={setTabValue} tabsLabel={tabsLabel} >
      <div style={{paddingRight:27,paddingLeft:27}}>
      { loadContent ?
          <LoadingContent />
        :
          <TabPanel key={0} value={tabValue} index={0} >
            {/* <TableComponent
              rowsCells={dataRows}
              selected={selected}
              setSelected={setSelected}
              loadContent={loadContent}
              search={search}
              handleCellClick={handleCellClick}
            /> */}
          </TabPanel>
      }
      </div>
    </NewTabs>
  );
}



