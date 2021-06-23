import React, {useState, useEffect,useMemo} from 'react';
import {AddModal} from './comp'
import {onCreateNewRiskData,onDeleteRiskData,onEditRiskData} from './func'
import {SubText,DescText,TextArea,} from './styles'
import { useSelector,useDispatch } from 'react-redux'
import {EspecialSelector} from '../../../MuiHelpers/EspecialSelector'
import {filterObject} from '../../../../../helpers/ObjectArray'
import {ContinueButton} from '../../../MuiHelpers/Button'
import {useNotification} from '../../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../../context/LoaderContext'
import {useAuth} from '../../../../../context/AuthContext'
import Week from './week'


export default function Modal({open,setOpen}) {

    const [data1, setData1] = useState('')
    const {currentUser} = useAuth()
    const {setLoad} = useLoaderScreen();
    const notification = useNotification()
    const dispatch = useDispatch()

    function onClose(allGood) {
      setOpen(false)
      if (allGood) setTimeout(() => {notification.success({message:allGood})}, 1000);
    }

    const infoModal = {
      title:'Você tem certeza?',text:'Ao sair as informações inseridas serão perdidas.'
    }

    return (
            <AddModal open={open} onClose={onClose} infoModal={infoModal}>
              {open ?
              <div style={{margin:'auto',padding:'100px 2%',zIndex:1,height:'100vh',width:'100vw',overflowY:'scroll',overflowX:'visible', alignItems:'center',justifyContent:'center'}}>
                <Week/>
                <ContinueButton onClick={()=>{}} style={{position:'fixed',right:40,bottom:20,width:110}} primary={'true'} size={'medium'} disable={`${false}`}>
                  <p>Salvar</p>
                </ContinueButton>
              </div>
              :null}
            </AddModal>
    );
}
