/* eslint-disable react/jsx-curly-newline */
import React from 'react';
// import AddModal, {Type,Form} from './comp'
// import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { useAuth } from '../../../../../context/AuthContext';
import { InputEnd } from '../../../../Main/MuiHelpers/Input';
import { NumberFormatCPF } from '../../../../../lib/textMask';
import { AscendentObject } from '../../../../../helpers/Sort';
import { SIGN } from '../../../../../routes/routesNames';
import { useNotification } from '../../../../../context/NotificationContext';
import { queryClient } from '../../../../../services/queryClient';
import { BootstrapTooltip } from '../../../../Main/MuiHelpers/Tooltip';
import { PERMISSIONS } from '../../../../../constants/geral';
import { fade } from '@material-ui/core/styles';
// import { useSellingData } from '../../../../../context/data/SellingContext';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CircularProgress from '@material-ui/core/CircularProgress';

const CheckoutContainer = styled.div`
  display:flex;
  width:100%;
  max-height:50px;
  min-height:50px;
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
    box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  align-items:center;
  justify-content: space-between;
  border-radius:18px;
  background-color: ${({theme})=>theme.palette.primary.main};
  background-image: linear-gradient(-10deg,${({ theme }) => theme.palette.primary.main},${({ theme }) => theme.palette.primary.light});
  overflow:hidden;
  /* background-color: ${({theme})=>theme.palette.background.paper}; */


  > div {
    background-color: ${({theme})=>theme.palette.background.paper};
    padding:0 20px;
    border-radius:20px;
    height:100%;
    display:flex;
    justify-content: space-between;

    align-items:center;
  }

  &:hover  {
      & div.total {
        margin-right:30px;
      }
    }


  > div.total {
    width:100%;
    transition: all 0.3s linear;
    margin-right:0px;
    min-width:fit-content;
    border-top-right-radius:50px;
    border-bottom-right-radius:50px;
    p {
      font-size: 18px;
      color: ${({theme})=>theme.palette.text.secondary};
      font-weight: bold;

      span {
        font-size: 20px;
        margin-left:0.5rem;
        color: ${({theme})=>theme.palette.text.primary};
        opacity:0.8;
      }
    }
  }

  > button {

    border:none;
    width:fit-content;
    font-size: 20px;
    width: 75%;
    padding-right:0.5rem;
    display:flex;
    align-items:center;
    background-color: transparent;
    /* background-color: ${({theme})=>theme.palette.primary.main}; */
    font-weight: bold;
    color: ${({theme})=>theme.palette.primary.contrastText};
    justify-content:flex-end;
    cursor: pointer;

    p {
      padding-right:10px;
    }

    svg {
      font-size: 30px;
    }

    &:hover {
      filter: brightness(0.80)
    }




  }

  @media screen and (max-width: 800px) {
    grid-area:check;
  }

`;


const CheckoutComponent = ({load, totalPrice }) => {

  // const { currentUser } = useAuth();
  // const isAdmin = currentUser?.access === 'admin'

  return (
    <CheckoutContainer>
      <div className='total'>
        <p>TOTAL:
          <span>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalPrice)}
          </span>
        </p>
      </div>

      <button disabled={load} type='submit'>
        <p>CONTINUAR</p>
        {load ?
          <CircularProgress
            size={24}
            style={{color: '#fff'}}
          />
        :
          <KeyboardArrowRightIcon/>
        }
      </button>
    </CheckoutContainer>
  );
};

export const CheckoutButton = React.memo(CheckoutComponent)
