import React, {useContext,useState,useEffect} from 'react';
import {Icons} from '../../../../components/Icons/iconsDashboard';
import {
  ContainerDiv,
  ButtonContainer,
  AddButtonActivitie
} from './styles';
import NewTabs, {TabPanel} from '../../../../components/Main/MuiHelpers/NewTabs'
import {FilterComponent,LoadingContent,AddUserButton} from '../../../../components/Main/Table/comp'
import Input, {InputEnd,InputUnform,SelectedEnd} from '../../../../components/Main/MuiHelpers/Input'
import {Link} from "react-router-dom";
import {keepOnlyNumbers} from '../../../../helpers/StringHandle';
import {useHistory} from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import {ModalButtons} from '../../../../components/Main/MuiHelpers/ModalButtons'
import { useSelector,useDispatch } from 'react-redux'
import {HeaderForm,FormContainer,SubTitleForm,TitleForm,DividerForm,AddAnotherForm,ButtonForm} from '../../../../components/Dashboard/Components/Form/comp'
import styled from "styled-components";
import {onSetProfessionData,onGetProfessionData} from './func'

const ButtonEditIcon = styled.div`
  cursor: pointer;
  &:hover {
    opacity:0.7;
    /* filter: brightness(0.95); */
  }

  &:active {
    opacity:0.8;
    /* filter: brightness(0.95); */
  }
`;
// import TableComponent from './table.js';

export function Container({children}) {
    return (
      <ContainerDiv >
        {children}
      </ContainerDiv>
    );
}

const initialData = [
  { name: 'Conector',activities:['Conexão com cliente']},
  { name: 'Educador Físico',activities:['Opção 1 Educador Físico','Opção 2 Educador Físico']},
  { name: 'Enfereiro',activities:['Opção 1 Enfereiro','Opção 2 Enfereiro']},
  { name: 'Farmacêutico',activities:['Opção 1 Farmacêutico iuh iu huiuihhuhuihu iuhuihiuh iuhui' ,'Opção 2 Farmacêutico']},
  { name: 'Fisoterapeuta',activities:['Opção 1 Fisoterapeuta','Opção 2 Fisoterapeuta']},
  { name: 'Fonoaudiólogo',activities:['Opção 1 Fonoaudiólogo','Opção 2 Fonoaudiólogo']},
  { name: 'Médico',inputs:['CRM'],activities:['Opção 1 Médico','Opção 2 Médico']},
  { name: 'Naturopata',activities:['Opção 1 Naturopata','Opção 2 Naturopata']},
  { name: 'Nutricionista',activities:['Opção 1 Nutricionista','Opção 2 Nutricionista']},
  { name: 'Psicólogo',activities:['Opção 1 Psicólogo','Opção 2 Psicólogo' ]},
  { name: 'Psicopedagogo',activities:['Opção 1 Psicopedagogo','Opção 2 Psicopedagogo']},
]

const Ascendent = function (a, b) {
  if (a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return 1;
  }
  if (b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return -1;
  }
  return 0;
};

export function TableContainer({tabsLabel,currentUser,notification,setLoad,setLoaderDash}) {

  const [loadContent, setLoadContent] = useState(true) //true
  const [tabValue, setTabValue] = useState(0);
  const [profession, setProfession] = useState('')
  const [newActivit, setNewActivit] = useState('')
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)

  useEffect(() => {
    onGetProfessionData({setData,notification,setLoaderDash,setLoadContent})
  }, [])

  const handleChangeProfession = (event,item) => {
    if (item == profession) return setProfession('')
    setProfession(item)
  };

  const onSave = () => {
    onSetProfessionData({data,dispatch,notification})
  }

  const onAddActivit = () => {

    if (!newActivit) return null

    if (!Array.isArray(open)) {
      if (data.findIndex(i=>i.name==newActivit) != -1) return notification.error({message:'Essa profissão já existe.'})
      const index = data.findIndex(i=>i.name==open)
      if (index == -1) {
        const newActivities = [...data,{name:newActivit,activities:[]}]
        setData([...newActivities])
      } else {
        var newActivities = [...data]
        newActivities[index] = {...newActivities[index],name:newActivit}
        setData([...newActivities])
      }
    } else {
      const index = data.findIndex(i=>i.name==open[0])
      if (open[1]) {
        if (data[index].activities.includes(newActivit) && newActivit!=open[1]) return notification.error({message:'Essa atividade já existe.'})
        const index2 = data[index].activities.findIndex(i=>i==open[1])
        var newData = [...data]
        var newActivities = [...data[index].activities]
        newActivities[index2] = newActivit
        newData[index].activities = [...newActivities]
        setData([...newData])
      } else {
        if (data[index].activities.includes(newActivit)) return notification.error({message:'Essa atividade já existe.'})
        var newData = [...data]
        const newActivities = [...data[index].activities,newActivit]
        newData[index].activities = [...newActivities]
        setData([...newData])
      }
    }


    if (!save) dispatch({ type: 'SAVE', payload: true })

  };

  const onDelete = () => {

    if (!newActivit) return null

    if (!Array.isArray(open)) {
      const index = data.findIndex(i=>i.name==open)
      if (index == -1) {
      } else {
        var newActivities = [...data]
        newActivities = newActivities.filter(i=>i.name!=newActivit)
        setData([...newActivities])
      }
    } else {
      const index = data.findIndex(i=>i.name==open[0])
      if (open[1]) {
        const index2 = data[index].activities.findIndex(i=>i==open[1])
        var newData = [...data]
        var newActivities = [...data[index].activities]
        newActivities = newActivities.filter(i=>i!=newActivit)
        newData[index].activities = [...newActivities]
        setData([...newData])
      } else {
      }
    }

    onCloseModalAdd()
    if (!save) dispatch({ type: 'SAVE', payload: true })

  };


  function onCloseModalAdd() {
    setOpen(false)
    setNewActivit('')
  }

  function onEditProf() {
    const index = data.findIndex(i=>i.name==open)
    if (!save) dispatch({ type: 'SAVE', payload: true })

  }

  return (
    <NewTabs tabValue={tabValue} setTabValue={setTabValue} tabsLabel={tabsLabel} >
      <div style={{paddingRight:27,paddingLeft:27,paddingBottom:20}}>
      { loadContent ?
          <LoadingContent />
        :
          <TabPanel key={0} value={tabValue} index={0} >
            <div style={{display:'inline-flex',marginTop:0,flexWrap:'wrap',alignContent:'center',width:'100%',padding:20}}>
              <div>
                {data.sort(Ascendent).map((item,index)=>{
                  if ((index)>=data.length/2) return null
                  return (
                    <div key={`${item.name}`} style={{width:'45%',minWidth:400,marginRight:50}}>
                      <div style={{display:'flex',flexDirection:'row',margin:'0 0 15px 0'}}>
                        <Checkbox
                          style={{margin:0,padding:'0 5px 0 0'}}
                          checked={profession==item.name}
                          size='small'
                          onChange={(event)=>handleChangeProfession(event,item.name)}
                          name={item.name}
                          color="primary"
                        />
                        <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                          {item.name}
                        </span>
                        <ButtonEditIcon onClick={()=>{
                          setNewActivit(item.name)
                          setOpen(item.name)}}>
                          <Icons style={{fontSize:20,padding:2,opacity:0.6}} type={`Edit`}/>
                        </ButtonEditIcon>
                      </div>
                      {profession==item.name && item.activities.length>0  ? item.activities.sort().map((activit,indexAct)=>{
                        return (
                          <div key={`${activit}${indexAct}`} style={{display:'flex',flexDirection:'column'}}>
                            <div style={{display:'flex',alignItems:'center',flexDirection:'row',margin:'0 0 10px 26px'}}>
                              <span style={{zIndex:110,marginBottom:0,marginRight:'0px',paddingRight:20,display:'inline-block',marginTop:0}}>
                                {activit}
                              </span>
                              <ButtonEditIcon onClick={()=>{
                                setNewActivit(activit)
                                setOpen([item.name,activit])}}>
                                <Icons style={{fontSize:20,padding:2,opacity:0.6}} type={`Edit`}/>
                              </ButtonEditIcon>
                            </div>
                            {indexAct == item.activities.length-1 &&
                              <AddButtonActivitie onClick={()=>setOpen([item.name])}>
                                <span>Adicionar Outro</span>
                              </AddButtonActivitie>
                            }
                          </div>
                        )
                      })
                      : profession==item.name &&
                        <AddButtonActivitie onClick={()=>{setOpen([item.name])}}>
                          <span>Adicionar Outro</span>
                        </AddButtonActivitie>
                      }
                    </div>
                  )
                })}
              </div>
              <div>
              {data.sort(Ascendent).map((item,index)=>{
                  if ((index+1)<data.length/2) return null
                  return (
                    <div key={`${item.name}`} style={{width:'45%',minWidth:400,marginRight:50}}>
                      <div style={{display:'flex',flexDirection:'row',margin:'0 0 15px 0'}}>
                        <Checkbox
                          style={{margin:0,padding:'0 5px 0 0'}}
                          checked={profession==item.name}
                          size='small'
                          onChange={(event)=>handleChangeProfession(event,item.name)}
                          name={item.name}
                          color="primary"
                        />
                        <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                          {item.name}
                        </span>
                        <ButtonEditIcon onClick={()=>{
                          setNewActivit(item.name)
                          setOpen(item.name)}}>
                          <Icons style={{fontSize:20,padding:2,opacity:0.6}} type={`Edit`}/>
                        </ButtonEditIcon>
                      </div>
                      {profession==item.name && item.activities.length>0  ? item.activities.sort().map((activit,indexAct)=>{
                        return (
                          <div key={`${activit}${indexAct}`} style={{display:'flex',flexDirection:'column'}}>
                            <div style={{display:'flex',alignItems:'center',flexDirection:'row',margin:'0 0 10px 26px'}}>
                              <span style={{zIndex:110,marginBottom:0,marginRight:'0px',paddingRight:20,display:'inline-block',marginTop:0}}>
                                {activit}
                              </span>
                              <ButtonEditIcon onClick={()=>{
                                setNewActivit(activit)
                                setOpen([item.name,activit])}}>
                                <Icons style={{fontSize:20,padding:2,opacity:0.6}} type={`Edit`}/>
                              </ButtonEditIcon>
                            </div>
                            {indexAct == item.activities.length-1 &&
                              <AddButtonActivitie onClick={()=>setOpen([item.name])}>
                                <span>Adicionar Outro</span>
                              </AddButtonActivitie>
                            }
                          </div>
                        )
                      })
                      : profession==item.name &&
                        <AddButtonActivitie onClick={()=>{setOpen([item.name])}}>
                          <span>Adicionar Outro</span>
                        </AddButtonActivitie>
                      }
                      {index == data.length-1 &&
                        <div>
                          <AddButtonActivitie prof onClick={()=>setOpen(' ')}>
                            <span>Adicionar Profissão</span>
                          </AddButtonActivitie>
                        </div>
                      }
                    </div>
                  )
              })}
              </div>
            </div>
            <ButtonForm onClick={()=>onSave()} disable={save?'false':'true'} primary={'true'} style={{width:'fit-content'}}>
              SALVAR
            </ButtonForm>
          </TabPanel>
      }
      </div>
      <ModalButtons
        open={Boolean(open)}
        disable={false}
        onClick={onAddActivit}
        onClose={onCloseModalAdd}
        title={!Array.isArray(open)?'Nova Profissão':'Nova Atividade'}
        padding={'large'}
      >
        <div style={{backgroundColor:'#fff',padding:0}}>
          <p style={{marginBottom:15}}>Adicione uma nova {Array.isArray(open)&&'atividade para a '}profissão{Array.isArray(open)&&':'} {Array.isArray(open) && <span style={{fontWeight:'bold'}}>{profession}</span>}</p>
          <InputEnd
            width={'100%'}
            onChange={({target})=>setNewActivit(target.value)}
            value={newActivit}
            size={'small'}
            labelWidth={90}
            name={'responsavel'}
            label={'Atividade'}
            title={newActivit}
            variant="outlined"
          />
          {((Array.isArray(open)&&open[1])||(!Array.isArray(open) && open != ' '))&&<div style={{width:400}}>
            <ButtonForm onClick={()=>onDelete()} style={{width:'fit-content',marginRight:'auto'}}>
              Deletar
            </ButtonForm>
          </div>}
        </div>
      </ModalButtons>
    </NewTabs>
  );
}



