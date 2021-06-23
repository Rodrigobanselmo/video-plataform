import React, { Component } from 'react';
import {useNotification} from '../../../../context/NotificationContext'
import Calendar from '../../../../components/Main/Calendar/WeekAdmin'
import Header from '../../../../components/Dashboard/Components/Blocks/Header'

export default function Home() {

  return (
    <div style={{justifyContent:'center',margin:'auto',alignItems:'center',flex:1}}>
      <Header icons={'Calendar'} title={'Gerenciar seus atendimentos'} video={true}/>
      <Calendar/>
    </div>
  );
}

