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

const TotalDiv = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: 0 20px;
  border-radius: 20px;
  height: 100%;
  display: flex;
  justify-content: space-between;

  align-items: center;
  width: 100%;
  transition: all 0.3s linear;
  min-width: fit-content;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  overflow: hidden;
  margin-right: 10px;
  p {
    font-size: 18px;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-weight: bold;

    span {
      font-size: 20px;
      margin-left: 0.5rem;
      color: ${({ theme }) => theme.palette.text.primary};
      opacity: 0.8;
    }
  }
`;

const Button = styled.button`
  display: flex;
  border: none;
  font-size: 18px;
  height: 100px;
  padding-right: 0.5rem;
  flex: 1;
  align-items: center;
  background-color: transparent;
  /* background-color: ${({ theme }) => theme.palette.primary.main}; */
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  justify-content: flex-end;
  cursor: pointer;

  p {
    padding-right: 10px;
  }

  svg {
    font-size: 30px;
  }

  &:hover {
    filter: brightness(0.8);
  }
`;

const CheckoutContainer = styled.div`
  z-index: 11000012002120021021;
  display: flex;
  width: 100%;
  height: 50px;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  box-shadow: 3px 3px 11px 1px rgba(0, 0, 0, 0.23);
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  background-image: linear-gradient(
    -10deg,
    ${({ theme }) => theme.palette.primary.main},
    ${({ theme }) => theme.palette.primary.light}
  );

  &:hover ${TotalDiv} {
    margin-right: 30px;
  }

  @media screen and (max-width: 800px) {
    grid-area: check;
  }
`;

const CheckoutComponent = ({ load, totalPrice }) => {
  // const { currentUser } = useAuth();
  // const isAdmin = currentUser?.access === 'admin'

  return (
    <CheckoutContainer>
      <TotalDiv className="total">
        <p>
          TOTAL:
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalPrice)}
          </span>
        </p>
      </TotalDiv>

      <Button disabled={load} type="submit">
        <p>CONTINUAR</p>
        {load ? (
          <CircularProgress size={24} style={{ color: '#fff' }} />
        ) : (
          <KeyboardArrowRightIcon />
        )}
      </Button>
    </CheckoutContainer>
  );
};

export const CheckoutButton = React.memo(CheckoutComponent);
