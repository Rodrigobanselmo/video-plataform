import React, { Component } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
export default function Home() {

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flex:1,height:'93%'}}>
      <Logo  height="20px" width="20px"/>
    </div>
  );
}

