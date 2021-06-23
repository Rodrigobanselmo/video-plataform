import React, { useState } from 'react';
import {Icons} from '../../../Icons/iconsDashboard'
import {Button} from './styles'
import Checkbox from '@material-ui/core/Checkbox';
import styled from "styled-components";
import {ButtonForm} from '../../../Dashboard/Components/Form/comp'


const Ascendent = function (a, b) {
  if (a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return 1;
  }
  if (b.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a.name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return -1;
  }
  return 0;
};


const Checkboxes = ({onConfirm,data,...props}) => {
  const [disabled, setDisabled] = useState(true)
  const [profession, setProfession] = useState([])
  const [activities, setActivities] = useState([])


  const handleChangeProfession = (event,item) => {
    setDisabled(false)
    if (!event.target.checked) {
      setProfession(profession=>[...profession.filter(i=>i!=item)])
      setActivities(activitie=>[...activitie.filter(i=>i.profession!=item)])
    } else {
      setProfession(profession=>[...profession,item])
      setActivities(activitie=>[...activitie,{activit:'',profession:item}])
    }
  };

  const handleChangeActivities = (event,activit,profession) => {
    setDisabled(false)
    if (!event.target.checked) {
      setActivities(activitie=>[...activitie.filter(i=>i.activit!=activit)])
    } else {
      setActivities(activitie=>[...activitie,{activit,profession}])
    }
  };

  const onHandleConfirm = () =>  {
    setDisabled(true)
    onConfirm(activities)
  }


  return(
    <>
      <div style={{display:'flex',marginTop:0,flexWrap:'wrap',width:'100%',padding:0}}>
          {data.sort(Ascendent).map((item,index)=>{
            return (
              <div key={`${item.name}`} style={{minWidth:250,paddingRight:10}}>
                <div style={{display:'flex',flexDirection:'row',margin:'10px 0 10px 0'}}>
                  <Checkbox
                    style={{margin:0,padding:'0 5px 0 0'}}
                    checked={profession.includes(item.name)}
                    size='small'
                    onChange={(event)=>handleChangeProfession(event,item.name)}
                    name={item.name}
                    color="primary"
                  />
                  <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                    {item.name}
                  </span>
                </div>
                {profession.includes(item.name) && item.activities.length>0  && item.activities.sort().map((activit,indexAct)=>{
                  const indexActivitie = activities.findIndex(i=>i.activit == activit&&i.profession == item.name)
                  return (
                    <div key={`${activit}${indexAct}`} style={{display:'flex',flexDirection:'column'}}>
                      <div style={{display:'flex',alignItems:'center',flexDirection:'row',margin:'0 0 10px 26px'}}>
                        <Checkbox
                          style={{margin:0,padding:'0 5px 0 0'}}
                          checked={indexActivitie != -1}
                          size='small'
                          onChange={(event)=>handleChangeActivities(event,activit,item.name)}
                          name={item.name}
                          color="primary"
                        />
                        <span style={{zIndex:110,marginBottom:0,maxWidth:200,marginRight:'0px',paddingRight:0,display:'inline-block',marginTop:0}}>
                          {activit}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
      <ButtonForm onClick={onHandleConfirm} disable={disabled?'true':'false'} primary={'true'} style={{width:'fit-content'}}>
        BUSCAR
      </ButtonForm>
    </>
  );
}

export default Checkboxes;

// <Icons  style={{fontSize:26,marginRight:8,marginLeft:-7}} type={iconName} {...iconProps}/>

