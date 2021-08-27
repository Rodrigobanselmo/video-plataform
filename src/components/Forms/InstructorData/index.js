/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// @ts-ignore
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
// import Modal from './Modal'
import styled, {css} from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import { InputEnd } from '../../Main/MuiHelpers/Input';
import { NumberHours, NumberDays } from '../../../lib/textMask';
import { useDispatch } from 'react-redux';
import { ButtonForm } from '../../Dashboard/Components/Form/comp';
import writeXlsxFile from 'write-excel-file'
import readXlsxFile from 'read-excel-file'
import { v4 } from 'uuid';
import { useNotification } from '../../../context/NotificationContext';

const ModuleView = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  margin: 10px 0 20px 0;
  padding: 10px;
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.23);

  > p {
    font-size:1.1rem;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 0 10px 0;
    > span {
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:1.1rem;
    }
  }
`;

const ClassesView = styled.div`
  background-color: ${({ theme }) => (theme.palette.background.line)};
  border-radius: 8px;
  margin: 0 0 10px 0;
  padding: 10px;

  > p:nth-child(1) {
    font-size:1rem;
    font-weight: bold;
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    > span {
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:1rem;
    }
  }

  > p:nth-child(2) {
    font-size:0.92rem;
    margin: 0 0 2px 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    > a {
      text-decoration: underline;
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:0.92rem;
      &:hover {
        opacity:0.7;
      }
    }

  }

  > p:nth-child(3) {
    font-size:0.92rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    > span {
      font-size:0.82rem;
      color: ${({ theme }) => theme.palette.primary.contrastText};
      background-color: ${({ theme,epi }) => epi?(theme.palette.status.success):(theme.palette.status.infoD)};
      font-weight: bold;
      padding: 1px 5px;
      border-radius: 4px;
      &.green {
        background-color: ${({ theme }) => theme.palette.status.orange};
      }
    }
  }

`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
`;

const Input = styled.input`
  margin-right: auto;
  padding: 20px;
  border: 2px dashed ${({ theme }) => theme.palette.background.line};
  border-radius: 10px;
`;

export const InstructorData = ({modules = {}, setModules, setCombos, combos, subCursos, setSubCursos}) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const notification = useNotification();

  return (
      <>
        {/* {modules.map((module,index)=>{
          return (
            <ModuleView key={module.id}>

            </ModuleView>
          )
        })} */}
        <ButtonsContainer>
          <ButtonForm
            style={{ marginBottom: '10px', minWidth: 100 }}
            primary
            type="button"
            loading={false}
          >
            Download
          </ButtonForm>
        </ButtonsContainer>
      </>
  );
};

