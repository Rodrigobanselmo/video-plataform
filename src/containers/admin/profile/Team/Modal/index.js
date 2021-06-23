import React, {useState, useEffect,useMemo} from 'react';
import AddModal, {Type,Form} from './comp'
import LinearProgress from '@material-ui/core/LinearProgress';
import {userTypes,headCells,rows} from '../../../../../constants/userTypes'
import {useNotification} from '../../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../../context/LoaderContext'
import { useAuth } from '../../../../../context/AuthContext'
import {ModalInfo} from '../../../../../components/Main/Modal/ModalInfo'
import Carrousel, {PagesDiv} from '../../../../../components/Main/Carrousel/CarrouselFirst'
import {onCreatePendingUser,onCheckUser} from './func'
import { useSelector,useDispatch } from 'react-redux'


export default function Modal({open,setOpen,setUsersRows}) {

    const [numInput, setNumInput] = useState(3) //numeros de inputs
    const [emails, setEmails] = useState([{email:'',status:'',message:'',type:''}]) //dados dos email inseridos nos inputs
    const [unform, setUnform] = useState({}) //dados dos email inseridos nos inputs
    const [infoModal, setInfoModal] = useState({title:'',text:''}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
    const [position, setPosition] = useState(1) //posicao do carrousel
    const [editEmail, setEditEmail] = useState(null) //dados dos email inseridos nos inputs


    const {currentUser} = useAuth();
    const {setLoad} = useLoaderScreen();
    const notification = useNotification();
    const dispatch = useDispatch()
    const save = useSelector(state => state.save)

    function onClose(allGood) {
        setOpen(false)
        setNumInput(3)
        setEmails([{email:'',status:'',message:'',type:''}])
        setInfoModal({title:'',text:''})
        setPosition(1)
        dispatch({ type: 'SAVE', payload: false })
        if (allGood) setTimeout(() => {notification.success({message:allGood})}, 1000);
    }

    function onGoBack() {
      if (position == 2) setInfoModal({title:'',text:''})
      else if (position == 3 && save) return notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim, os dados inseridos serão perdidos?',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
        setPosition(position=>position-1)
        dispatch({ type: 'SAVE', payload: false })
      }})
      setPosition(position=>position-1)
    }


    function onForm() {

    }

    function onEditForm(email) {
      setPosition(pos=>(pos+1))
      setEditEmail(email)
    }

    const filteredEmails = emails.filter(i =>i?.status && i.status==='Check')
    const noRepeatEmails = filteredEmails.filter((item,index)=>filteredEmails.findIndex((i)=>i?.email && item?.email && i.email===item.email) === index)

    function onSendRequest() {
        setLoad(true)
        onCreatePendingUser({dataToTreat:noRepeatEmails,unform,currentUser,notification,setLoad,onClose,setUsersRows})
    }

    return (
            <AddModal open={open} onClose={onClose} infoModal={infoModal} arrow={position >= 2 ? true : false} onGoBack={onGoBack}>
              <Carrousel sections={3} position={position}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:550,margin:'auto'}}>
                      <div style={{alignItems:'center',display:'flex',flexDirection:'column',margin:'0px 20px'}}>
                          <AddModal.Header
                            center
                            text='Adicionar Novos Usuários'
                            subText='Você poderá mudar as permissões dos novos usuários na proxima sessão.'
                          />
                          <AddModal.EmailInput setEmails={setEmails} emails={emails} numInput={numInput} setNumInput={setNumInput} notification={notification} onCheckUser={onCheckUser} companyId={currentUser}/>
                          <AddModal.Continue disable={!emails.find(i=>i && i?.status && i.status==='Check')} setInfoModal={setInfoModal} notification={notification} setPosition={setPosition}/>
                      </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:550,margin:'auto'}}>
                      <div style={{alignItems:'center',display:'flex',flexDirection:'column',margin:'0px 20px'}}>
                          <AddModal.Header
                            center
                            text='Definir permissões'
                            subText='Defina o tipo dos novos usuários e quais serão suas permissões de uso da plataforma.'
                          />
                          <Type onEditForm={onEditForm} noRepeatEmails={noRepeatEmails} emails={emails} setEmails={setEmails} userTypes={userTypes}/>
                          <AddModal.Continue onSendRequest={onSendRequest} second disable={false} setInfoModal={setInfoModal} setPosition={setPosition}/>
                      </div>
                  </div>
                  <PagesDiv style={{padding:'0 20px 0px 20px',maxWidth:1100}} overflowTrue>
                    {position == 3 &&
                    <div style={{display:'flex',flex:1,width:'100%',flexDirection:'column',margin:'0px 20px'}}>
                        <Form editEmail={editEmail} notification={notification} unform={unform} setUnform={setUnform} onForm={onForm}/>
                    </div>
                    }
                  </PagesDiv>
                </Carrousel>
            </AddModal>
    );
}
