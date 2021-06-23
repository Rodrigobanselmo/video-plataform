import React, { useState,useEffect } from 'react';
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
import Calendar from '../../../../components/Main/Calendar/WeekConector'
import Checkboxes from '../../../../components/Main/Professions/Checkboxes'
import Header from '../../../../components/Dashboard/Components/Blocks/Header'
import styled from "styled-components";
import {onGetCalendarDate, onGetProfessionDate} from './func'
import {useLoaderScreen} from '../../../../context/LoaderContext'

const Container = styled.div`
  padding: 16px 16px 16px 16px;
  box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.22);
  border-radius:10px;
  background-color: ${({theme})=>theme.palette.background.paper};
  max-width:782px;
  margin-bottom:20px;
`;

export default function Home() {


  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const {setLoad} = useLoaderScreen();

  const [calendar, setCalendar] = useState([])
  const [specialist, setSpecialist] = useState([])
  // const [specialist, setSpecialist] = useState([])
  const [allProfession, setAllProfession] = useState([])
  const [allProfessionData, setAllProfessionData] = useState([])

  useEffect(() => {
    onGetProfessionDate({setAllProfession,setAllProfessionData,notification,setLoaderDash})
  }, [])

  console.log('calendar',calendar)

  function onConfirmProfessionSearch(activities) {
    console.log(activities)

    if (activities.filter(i=>i.activit != '').length == 0) return notification.warn({message:'Selecione uma especialidade.',modal:false})

    const array = [];
    Object.keys(allProfession).map(keyUid=>{
      allProfession[keyUid].profession.map(object=>{
        !array.includes(keyUid) && activities.filter(i=>i.activit != '').findIndex(i=>i.activit == object.activit) != -1 && array.push(keyUid)
      })
    })

    const special = []
    activities.filter(i=>i.activit != '').map(item=>{
      special.push(item.activit)
    })

    console.log('keyUid',array)
    console.log('special',special)

    setSpecialist([...special])
    onGetCalendarDate({usersId:array,setCalendar,notification,setLoad})
  }

  return (
    <>
      <Header icons={'Calendar'} title={'Horarios de Atendimento'} video={true}/>
      <Container>
        <Checkboxes data={allProfessionData} onConfirm={onConfirmProfessionSearch} />
      </Container>
      <Calendar calendarData={calendar} specialty={specialist}/>
    </>
  );
}
//[{name:'1213',id:1},{name:'3 3213 123',id:2},{name:'2 321132',id:3}]

