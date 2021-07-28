import React, {useState, useEffect,useMemo} from 'react';
// import AddModal, {Type,Form} from './comp'
import {userTypes,headCells,rows} from '../../../../constants/userTypes'
import {useNotification} from '../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useAuth } from '../../../../context/AuthContext'
import Carrousel, {PagesDiv} from '../../../Main/Carrousel/CarrouselFirst'
import { useSelector,useDispatch } from 'react-redux'
import { ModalFullScreen } from '../../ModalFullScreen';
import styled from "styled-components";
import { HeaderModal } from '../../Components/Header';
import { AddUserData } from '../../../Forms/AddUserData';
import { SideEmail } from './Side';
import { CheckoutButton } from './CheckoutButton';
import { useQuery } from 'react-query';
import { db } from '../../../../lib/firebase.prod';
import { useCreateUsers } from '../../../../services/hooks/set/useCreateUsers';
import { UpdateUserData } from '../../../Forms/UpdateUserData';
import { SellingContext } from '../../../../context/data/SellingContext';
import { queryClient } from '../../../../services/queryClient';
import * as Yup from 'yup';
import { isUnique } from '../../../../helpers/yupMethods';
import { TestaCPF } from '../../../../helpers/StringVerification';
import { Form } from "@unform/web";
import { formatCPFeCNPJeCEPeCNAE, keepOnlyNumbers, wordUpper } from '../../../../helpers/StringHandle';
import { v4 } from 'uuid';
import { SIGN } from '../../../../routes/routesNames';
import { FirstPageAddModal } from './FirstPage';
import { CheckoutPage } from './CheckoutPage';

export function AddMemberModal({open,setOpen,isAddClient,update}) {

  const {currentUser} = useAuth();
  const mutation = useCreateUsers()

  // const [email, setEmail] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
  // const [unform, setUnform] = useState({}) //dados dos email inseridos nos inputs
  const [infoModal, setInfoModal] = useState({title:'',text:''}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
  const [position, setPosition] = useState(1) //posicao do carrousel

  const {setLoad} = useLoaderScreen();
  const notification = useNotification();
  const dispatch = useDispatch()
  const save = useSelector(state => state.save)

  const cursosAllData = queryClient.getQueryData('cursos');


  const [fieldEdit, setFieldEdit] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
  const [dataUser, setDataUser] = useState({})
  const [cursos, setCursos] = useState({});
  const [permissions, setPermissions] = useState({});
  const [prices, setPrices] = useState([]);

  const [checkoutInfo, setCheckoutInfo] = useState({});
  // const [dataUser, setDataUser] = useState({}) //dados dos email inseridos nos inputs
  // const [cursosSelected, setCursosSelected] = useState({});
  // const [permissions, setPermissions] = useState({});

  function onClose() {
      if (mutation.isLoading) return

      setFieldEdit({value:null,index:null})
      setDataUser({})
      setCursos({})
      setPermissions({})
      setCheckoutInfo({})
      setPrices([])
      setOpen(false)
      setPosition(1)
    }

  function onGoBack() {
  //   if (position == 2) setInfoModal({title:'',text:''})
  //   else if (position == 3 && save) return notification.modal({title: '',text:'Você possui dados não salvos, tem certeza que deseja sair mesmo assim, os dados inseridos serão perdidos?',rightBnt:'Sair sem salvar',open:true,onClick:()=>{
  //     setPosition(position=>position-1)
  //     dispatch({ type: 'SAVE', payload: false })
  //   }})
    setPosition(position=>position-1)
  }

  function onCalcUserPrice(cursos) {

    const cursosArray = [];
    Object.keys(cursos).map((key)=>{
      if (!cursos[key]) return null

      const fieldIndex = key.split('--')[0]
      const cursoId = key.split('--')[1]

      if (Array.isArray(cursos[key])) {
        //curso de epi de segunda order
        if (!cursosArray[fieldIndex]) cursosArray[fieldIndex] = []

        return cursosArray[fieldIndex].push(...cursos[key].map(i=>cursoId))
      } else {
        //curso normal de primeira order
        if (!cursosArray[fieldIndex]) cursosArray[fieldIndex] = []

        return cursosArray[fieldIndex].push(cursoId)
      }
    })

    const price = cursosArray.map(fieldArray=>{
      return fieldArray.reduce((acc,item,index)=>{
        const isFirstTimePassing = fieldArray.findIndex(i=>i==item) == index
        if (!isFirstTimePassing) return acc

        const cursoFull = cursosAllData.find(i=>i.id === item)
        if (cursoFull?.combos) {
          const combosLength = cursoFull.combos.length
          const cursosLength = fieldArray.filter(i=>i == item).length
          console.log(combosLength,cursosLength)
          if (combosLength <= cursosLength) { // se nao tiver pacote fica mesmo preço que o combo mais caro
            return acc + cursoFull.combos[combosLength-1].price
          } else {
            return acc + cursoFull.combos[cursosLength-1].price
          }
        }
      }, 0)
    })

    return price // [80,90,...]
  }

  return (
    <SellingContext.Provider value={{ onCalcUserPrice, checkoutInfo, setCheckoutInfo, dataUser, setDataUser, cursos, setCursos, permissions, setPermissions, prices, setPrices, fieldEdit, setFieldEdit }}>
        <ModalFullScreen open={open} arrow={position >= 2 ? true : false} onClose={onClose} infoModal={infoModal} onGoBack={onGoBack}>
          <Carrousel sections={2} position={position}>
            <FirstPageAddModal
              setPosition={setPosition}
              isAddClient={isAddClient}
            />
            <CheckoutPage
              checkoutInfo={checkoutInfo}
            />
          </Carrousel>
        </ModalFullScreen>
      </SellingContext.Provider>
  );
}
