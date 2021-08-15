import React, { Component } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
import { Redirect } from "react-router-dom"
import { CURSOS } from '../../../routes/routesNames';

export default function Home() {

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flex:1,height:'93%'}}>
              <Redirect to={{
          pathname: CURSOS,
        }} />
    </div>
  );
}

