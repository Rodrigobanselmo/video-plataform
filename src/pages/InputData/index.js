
import React, {useState, useEffect,useMemo} from 'react';
import {useNotification} from '../../context/NotificationContext'
import {useLoaderScreen} from '../../context/LoaderContext'
import { useLoaderDashboard } from '../../context/LoadDashContext';
import { useAuth } from '../../context/AuthContext'

import Carrousel, {PagesDiv} from '../../components/Main/Carrousel/CarrouselFirst'
import Page, {FirstForm,SecondForm,ThirdForm,BanksForm} from './comp'
import {onAddUserData,onUpdateProfile} from './func'
import { onLogout } from '../../components/Dashboard/NavSystem/func';
import styled from "styled-components";
import { PersonalData } from '../../components/Main/Forms/PersonalData';
import { CompanyData } from '../../components/Main/Forms/CompanyData';
import { ProfessionalData } from '../../components/Main/Forms/ProfessionalData';


export default function InputUserData() {

  const {currentUser,setCurrentUser} = useAuth();
  const {setLoad} = useLoaderScreen();
  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const [position, setPosition] = useState(1)
  const [unform, setUnform] = useState({uf:'AC',address:{},company:{juridica:true},...currentUser})

  const INFO_MODAL = {title:'Você tem certeza?',text:'Ao sair você irá pausar sua inscrição e poderá perder as informaçoes inseridas até o momento.'} // para mandar pro modalFullScreen e dizer se ao fechar da um alerta


  const HAS_COMPANY = currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('co'); //company
  const HAS_PROFESSION = currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('pr'); //professional

  const PERSONAL_DATA = currentUser?.name && currentUser?.rg && currentUser?.cell;
  const COMPANY_DATA = currentUser?.address?.cep && currentUser?.company?.cpfOrCnpj;
  const PROFESSION_DATA = currentUser?.resume;

  useEffect(() => {
    setTimeout(() => {
      setLoaderDash(false)
    }, 600);
  }, [])



  function onAddData({data,createCompany}) {
      onAddUserData({data,createCompany,currentUser,setCurrentUser,setLoad:setLoaderDash,notification})
  }
  function onUploadProfile(image) {
    onUpdateProfile({image,setUnform,currentUser,setCurrentUser,setLoad,notification})
  }

  function onFirstForm(dataForm) {
    setUnform(data=>({...data,...dataForm}))
    if (!HAS_COMPANY && !HAS_PROFESSION) onAddData({data:{...unform,...dataForm}})
    else setPosition(position=>position+1)
  }

  function onSecondForm(dataForm) {
    setUnform(data=>({...data,...dataForm}))
    if (!HAS_PROFESSION) onAddData({data:{...unform,...dataForm},createCompany:true})
    else setPosition(position=>position+1)
  }

  function onThirdForm(dataForm) {
    setUnform(data=>({...data,...dataForm}))
    onAddData({data:{...unform,...dataForm}})
  }

  const SECTIONS = 1+(HAS_COMPANY?1:0)+(HAS_PROFESSION?1:0)

  return (
      <Page>
        {unform&&
          <>
            <Carrousel sections={SECTIONS} position={position}>
              <PagesDiv overflowTrue>
                <Page.Header
                  text='Dados Pessoais'
                  subText='Preencha com seus dados pessoais para prosseguir'
                />
                <PersonalData onUploadProfile={onUploadProfile} notification={notification} unform={unform} setUnform={onFirstForm}/>
              </PagesDiv>
              {HAS_COMPANY && <PagesDiv overflowTrue>
                <Page.Header
                  text='Dados da Endereço'
                  subText='Informe os dados de sua empresa para gerar certificações dos cursos.'
                />
                <CompanyData unform={unform} setUnform={setUnform} onSecondForm={onSecondForm} notification={notification}/>
              </PagesDiv>}
              {HAS_PROFESSION && <PagesDiv overflowTrue>
                <Page.Header
                  text='Dados Profissionais'
                  subText='Preencha com seus dados profissionais para prosseguir'
                />
                <ProfessionalData unform={unform} setUnform={onThirdForm}/>
              </PagesDiv>}
            </Carrousel>
            <Page.IconClose notification={notification} setLoad={setLoad} infoModal={INFO_MODAL} onLogout={onLogout}/>
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

