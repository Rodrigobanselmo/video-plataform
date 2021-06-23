import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import {Icons} from '../../../components/Icons/iconsDashboard'
//undraw_mobile_testing_reah
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled from "styled-components";

const CardClient = styled.div`
    background-color: red;
    min-height:40px;
    width:100%;
    overflow-y:auto;
    padding: 8px 10px;
    border-radius:5px;
    background-color: ${({theme})=>theme.palette.primary.mainPurple};
    -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.23);
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.23);

    & .name {
      font-size:16px;
      font-family: sans-serif , Arial;
      margin:0px;
      padding:0px;
      margin-bottom:3px;
    }

    & .plan {
      font-size:12px;
      font-family: sans-serif , Arial;
      padding:0px;
      margin:0px;
    }

    & .planStart {
      font-size:10px;
      display:inline-block;
      font-family: sans-serif , Arial;
      margin:0px;
      padding:0px;
    }

    &:hover {
        opacity:0.8;
    }
    &:active {
      opacity:0.9;
    }

`;


const ContainerRight = styled.div`
  display: flex;
  flex: 1;
  background-color: ${({theme})=>theme.palette.background.paper};
  -webkit-box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.23);
  border-radius:10px;
  padding: 10px 0px;
  flex-direction:column;
  overflow-x:visible;

  p {
   font-size:18px;
   font-family: sans-serif , Arial;
   margin: 0px 20px;
   margin-bottom:10px;
  }

  & .scrollView {
    height:100%;
    padding: 5px 20px;
    width:100%;
    overflow-y:auto;
    overflow-x:visible;
  }


`;


export default function Home() {

  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    // onGetHomeData({setClients,notification,setLoaderDash})
  }, [])

console.log(clients)
function name(params) {
  fetch('https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/AAASABESP.pdf?alt=media&token=0995fc68-c045-48e0-9e80-c93c13d1c506' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
  .then((response) => response.blob())
  .then((blob) => {
    // Create blob link to download
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `FileName.pdf`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  });
}

  return (
    <div style={{display:'flex',flexDirection:'row',flex:1,height:'88%'}}>
      <div style={{display:'flex',flex:3,marginRight:10}}>
        <div onClick={()=>{}}>
          <a  target="_blank" href={'https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/AAASABESP.pdf?alt=media&token=0995fc68-c045-48e0-9e80-c93c13d1c506'}>
          <Icons style={{fontSize:140}} type={`Avatar`}/>
          </a>
        </div>
      </div>
      <ContainerRight >
        <p>Clientes sem conectores</p>
      </ContainerRight>
    </div>
  );
}


//https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/AAASABESP.pdf?alt=media&token=0995fc68-c045-48e0-9e80-c93c13d1c506
{/* <Logo  height="400px" width="400px"/> */}
