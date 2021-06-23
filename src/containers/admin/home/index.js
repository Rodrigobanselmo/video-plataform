import React, { useEffect, useState } from 'react';
import {useNotification} from '../../../context/NotificationContext'
import {useLoaderDashboard} from '../../../context/LoadDashContext'
//undraw_mobile_testing_reah
import { ReactComponent as Logo } from './undraw_mobile_testing_reah.svg';
import {NormalizeData} from '../../../helpers/DataHandler';
import {onGetHomeData} from './func'
import styled from "styled-components";

import axios from 'axios';
import { saveAs } from 'file-saver';

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
    onGetHomeData({setClients,notification,setLoaderDash})
  }, [])

  const createAndDownloadPdf = () => {
    console.log(0)
    axios({
      method:'post',
      url:'http://localhost:3002/pdf',
      responseType: 'blob',
      data:{
        firstName: 'Fred',
        lastName: 'Flintstone',
        image:'https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/profile%2FdzCVhvcg1PbZ3YQGStVHc8h3uXH2_300x300?alt=media&token=c42e5822-60bf-4a60-a98d-f17f8143e07d'
      }
    }).then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      console.log(1)
      saveAs(pdfBlob, 'newPdf.pdf');
    })
  }

// console.log(clients)

  return (
    <div style={{display:'flex',flexDirection:'row',flex:1,height:'88%'}}>
      <div style={{display:'flex',flex:3,marginRight:10}}>

        <button onClick={createAndDownloadPdf}>Download PDFs</button>

      </div>
      <ContainerRight >
        <p>Clientes sem conectores</p>
        <div className={'scrollView'}>
          {clients.map(client=>{

            var dateStart = client.plan?.start ? NormalizeData(new Date(parseInt(client.plan.start)),'normal') : 'Indisponível';
            var dateEnd = client.plan?.end ? NormalizeData(new Date(parseInt(client.plan.end)),'normal') : 'Não Informado';

            return (
              <CardClient>
                <p className={'name'}>{client.name}</p>
                <div style={{display:'flex',flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                  <p className={'plan'}>Plano: {client.plan.name}</p>
                  <p className={'planStart'}>{dateStart} -- {dateEnd}</p>
                </div>
              </CardClient>
            )
          })}
        </div>
      </ContainerRight>
    </div>
  );
}



{/* <Logo  height="400px" width="400px"/> */}
