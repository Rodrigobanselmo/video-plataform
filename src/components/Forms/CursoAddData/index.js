/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// @ts-ignore
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
// import Modal from './Modal'
import styled from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import { InputEnd } from '../../Main/MuiHelpers/Input';
import { NumberHours, NumberDays } from '../../../lib/textMask';

export const CursoAddData = ({initialData = {}}) => {
  const [data, setData] = useState(initialData)

  const onChangeName = ({target}) => {
    const { value } = target;
    setData(dt=>({...dt, name:value}))
  }

  const onDaysToExpire = ({target}) => {
    const { value } = target;
    if (value < 0 ) return
    setData(dt=>({...dt, daysToExpire:value}))
  }

  const onDuration = ({target}) => {
    const { value } = target;
    if (value < 0 ) return
    setData(dt=>({...dt, duration:value}))
  }


  return (
      <>
        <InputEnd
          labelWidth={100}
          label="Nome do Curso"
          icon="Info"
          name='name'
          width={'50%'}
          variant="outlined"
          value={data?.name ?? ''}
          onChange={onChangeName}
          title="Aqui você deve informar o nome do curso"
          inputProps={{style: {textTransform: 'capitalize'}}}
          status="Normal"
          style={{marginRight:20}}
          validation
        />
        <InputEnd
          labelWidth={115}
          label="Dias até expirar"
          style={{marginRight:20}}
          width={'25%'}
          name='daysToExpire'
          icon="Info"
          variant="outlined"
          value={data?.daysToExpire ?? ''}
          onChange={onDaysToExpire}
          title="Aqui você deve informar o número máximo de dias que o aluno irá ter para finalizar o curso após inicia-lo"
          status="Normal"
          validation
          inputComponent={NumberDays}
        />
        <InputEnd
          labelWidth={70}
          label="Duração"
          width={'25%'}
          icon="Info"
          name='duration'
          variant="outlined"
          value={data?.duration ?? ''}
          onChange={onDuration}
          title="Aqui você deve informar o número aproximado de horas para se realizar o curso"
          status="Normal"
          validation
          // type="number"
          inputComponent={NumberHours}
        />
      </>
  );
};

