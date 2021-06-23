
import React, {useState, useEffect,useMemo} from 'react';
import {useNotification} from '../../context/NotificationContext'
import {useLoaderScreen} from '../../context/LoaderContext'
import { useAuth } from '../../context/AuthContext'

import Carrousel, {PagesDiv} from '../../components/Main/Carrousel/CarrouselFirst'
import Page, {FirstForm,SecondForm,ThirdForm,BanksForm} from './comp'
import {onAddUserData,onUpdateProfile} from './func'
import { onLogout } from '../../components/Dashboard/NavSystem/func';
import styled from "styled-components";

const initialData =[{data:'',name:'Nome',status:'',message:'',placeholder:'Nome',required:true},{data:'',name:'Sobrenome',status:'',message:'',placeholder:'Sobrenome',required:true},{data:'',name:'CPF',status:'',message:'',placeholder:'000.000.000-00',required:true}]
const engineryData = {data:'',name:'CREA',status:'OK',message:'',placeholder:'CREA'}
const doctorData = {data:'',name:'CRM',status:'OK',message:'',placeholder:'CRM'}
const nurseData = {data:'',name:'COREN',status:'OK',message:'',placeholder:'COREN'}

const finalData = {
  "uf": "SP",
  "nome": "rodrigo barbosa",
  "cpf": "401.951.858-03",
  "rg": "39.602.612-6",
  "cell": "(12) 99999-9999",
  "facebook": "",
  "instagram": "",
  "complemento": "",
  "logradouro": "Rua Heitor Vieira Júnior",
  "municipio": "São José dos Campos",
  "bairro": "Altos do Esplanada",
  "cep": "12246013",
  "address": {
    "cep": "12.246-013",
    "rua": "Rua Heitor Vieira Júnior",
    "bairro": "Altos do Esplanada",
    "numero": "12",
    "complemento": "400",
    "municipio": "São José dos Campos"
  },
  "Médico-CRM": "12345",
  "profession": [
    {
      "activit": "Opção 1 Educador Físico",
      "profession": "Educador Físico"
    },
    {
      "activit": "Opção 1 Médico",
      "profession": "Médico"
    }
  ]
}

export default function InputUserData() {

    const [data, setData] = useState([...initialData])
    const {currentUser,setCurrentUser} = useAuth();
    const [infoModal, setInfoModal] = useState({title:'Você tem certeza?',text:'Ao sair você irá pausar sua inscrição e poderá perder as informaçoes inseridas até o momento.'}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
    const [position, setPosition] = useState(1)
    const [checked, setChecked] = useState(false);
    const [unform, setUnform] = useState({uf:'AC',address:{},bankAccount:{type:'Conta corrente',juridica:'false'},...currentUser})

    const {setLoad} = useLoaderScreen();
    const notification = useNotification();

    function onAddData() {
        onAddUserData({unform,currentUser,setCurrentUser,setLoad,notification})
    }
    function onUploadProfile(image) {
      onUpdateProfile({image,setUnform,currentUser,setCurrentUser,setLoad,notification})
    }

    function onFirstForm(dataForm) {
      setUnform(data=>({...data,...dataForm}))
      setPosition(position=>position+1)
    }

    function onSecondForm(dataForm) {
      setUnform(data=>({...data,...dataForm}))
      setPosition(position=>position+1)
    }

    function onThirdForm(dataForm) {
      setUnform(data=>({...data,...dataForm}))
      setPosition(position=>position+1)
    }

    return (
        <Page>
          {unform&&
            <>
            <Carrousel sections={5} position={position}>
                <PagesDiv overflowTrue>
                    <div style={{display:'flex',flex:1,width:'100%',flexDirection:'column',margin:'0px 20px'}}>
                        <Page.Header
                          text='Dados Pessoais'
                          subText='Preencha com seus dados pessoais para prosseguir'
                        />
                        <FirstForm onUploadProfile={onUploadProfile} notification={notification} unform={unform} setUnform={onFirstForm}/>
                        {/* <Page.Continue data={data} setInfoModal={setInfoModal} notification={notification} setPosition={setPosition}/> */}
                    </div>
                </PagesDiv>
                <PagesDiv overflowTrue>
                    <div style={{display:'flex',flex:1,width:'100%',flexDirection:'column',margin:'0px 20px'}}>
                        <Page.Header
                          text='Dados de Endereço'
                          subText='Informe seu endereço para receber correspondências'
                        />
                        <SecondForm unform={unform} setUnform={setUnform} onSecondForm={onSecondForm}/>
                    </div>
                </PagesDiv>
                <PagesDiv overflowTrue>
                    <div style={{display:'flex',flex:1,width:'100%',flexDirection:'column',margin:'0px 20px'}}>
                        <Page.Header
                          text='Dados Bancários'
                          subText='Preencha com seus dados bancários para prosseguir'
                        />
                        <BanksForm setPosition={setPosition} notification={notification} unform={unform} setUnform={setUnform}/>
                        {/* <Page.Continue data={data} setInfoModal={setInfoModal} notification={notification} setPosition={setPosition}/> */}
                    </div>
                </PagesDiv>
                <PagesDiv overflowTrue>
                    <div style={{display:'flex',flex:1,width:'100%',flexDirection:'column',margin:'0px 20px'}}>
                        <Page.Header
                          text='Dados Profissionais'
                          subText='Informe seus dados profissionais para prosseguir'
                        />
                        <ThirdForm notification={notification} unform={unform} setUnform={setUnform} onThirdForm={onThirdForm}/>
                    </div>
                </PagesDiv>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:850,margin:'auto'}}>
                    <div style={{alignItems:'center',display:'flex',flexDirection:'column',margin:'0px 20px'}}>
                        <Page.Header second/>
                        <Page.Politics setChecked={setChecked} checked={checked} />
                        <Page.Continue checked={checked} onAddData={onAddData}/>
                    </div>
                </div>
            </Carrousel>
            <Page.IconClose notification={notification} setLoad={setLoad} infoModal={infoModal} onLogout={onLogout}/>
              <>
                {position > 1 ?
                    <Page.IconBack setPosition={setPosition} />
                : null }
              </>
            </>
          }
          </Page>
    );
}

