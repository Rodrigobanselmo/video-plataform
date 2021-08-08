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

export function AddMemberModal({open,setOpen, isNewClient, update}) {
    const {currentUser} = useAuth();
    // const [email, setEmail] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
    // const [unform, setUnform] = useState({}) //dados dos email inseridos nos inputs
    const [infoModal, setInfoModal] = useState({title:'',text:''}) //para mandar pro modalFullScreen e dizer se ao fechar da um alerta
    const [position, setPosition] = useState(1) //posicao do carrousel

    // const {setLoad} = useLoaderScreen();
    // const notification = useNotification();
    // const dispatch = useDispatch()
    // const save = useSelector(state => state.save)

    const cursosAllData = queryClient.getQueryData('cursos');

    const [fieldEdit, setFieldEdit] = useState({value:null,index:null}) //dados dos email inseridos nos inputs
    const [dataUser, setDataUser] = useState({})
    const [cursos, setCursos] = useState({});
    const [permissions, setPermissions] = useState({});
    const [prices, setPrices] = useState([]);
    const [credit, setCredit] = useState([]);

    const [checkoutInfo, setCheckoutInfo] = useState({});

    const onEnd = React.useCallback(() => {
      setFieldEdit({value:null,index:null})
      setDataUser({})
      setCursos({})
      setPermissions({})
      setCheckoutInfo({})
      setPrices([])
      setOpen(false)
      setPosition(1)
    },[]);

    const onClose = () => {
      if (queryClient.isMutating()) return
      onEnd()
    };

    function onGoBack() {
      setPosition(position=>position-1)
    }

    function onCalcUserPrice(cursos) {

      const cursosArray = [];
      Object.keys(cursos).map((key)=>{

        const fieldIndex = key.split('--')[0]
        const cursoId = key.split('--')[1]
        if (!cursosArray[fieldIndex]) cursosArray[fieldIndex] = []

        if (!cursos[key]) return null

        if (Array.isArray(cursos[key])) {
          //curso de epi de segunda order

          return cursosArray[fieldIndex].push(...cursos[key].map(i=>cursoId))
        } else {
          //curso normal de primeira order

          return cursosArray[fieldIndex].push(cursoId)
        }
      })

      const price = cursosArray.map(fieldArray=>{ // [ cursoId1, cursoId1, cursoId2, ..... ]
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

    const onBilling = () => {
      const fieldIndex = fieldEdit?.index
      const isAdmin = currentUser?.access === 'admin'
      const isFM =  permissions[(`${fieldIndex}--fm`)]

      if (!isAdmin) return true
      if (isAdmin && isFM) return true
      return false
    }

    const isBilling = useMemo(() => onBilling(), [fieldEdit, permissions])

    const onTotalPrice = () => {
      return  prices.reduce((acc,price,index)=>{
        if (isBilling && !isNewClient) return Number(acc)+Number(price)-Number(credit[index]?credit[index]:0)
        return acc
      },[0])
    }

    const totalPrice = useMemo(() => onTotalPrice(), [prices, permissions, isBilling, credit])

    console.log('totalPrice',totalPrice)
    console.log('credit',credit)
    console.log('prices',prices)
    return (
      <SellingContext.Provider value={{ onCalcUserPrice, credit, setCredit, totalPrice, isBilling, checkoutInfo, setCheckoutInfo, dataUser, setDataUser, cursos, setCursos, permissions, setPermissions, prices, setPrices, fieldEdit, setFieldEdit }}>
          <ModalFullScreen open={open} arrow={position >= 2 ? true : false} onClose={onClose} infoModal={infoModal} onGoBack={onGoBack}>
            <Carrousel sections={2} position={position}>
              <FirstPageAddModal
                setPosition={setPosition}
                onEnd={onEnd}
                isNewClient={isNewClient}
                update={update}
              />
              <CheckoutPage
                checkoutInfo={checkoutInfo}
                totalPrice={totalPrice}
                onEnd={onEnd}
                update={update}
              />
            </Carrousel>
          </ModalFullScreen>
        </SellingContext.Provider>
    );
}
