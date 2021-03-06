/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// @ts-ignore
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useImperativeHandle } from 'react';
// import Modal from './Modal'
import styled from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import { InputEnd } from '../../Main/MuiHelpers/Input';
import { NumberHours, NumberDays, NumberMonths } from '../../../lib/textMask';
import { useDispatch } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Label = styled.p`
  font-size: 1.1rem;
  margin-top: 10px;
  margin-bottom: 1px;
`;

export const FormLabel = styled(FormControlLabel)`
  color: ${({ theme }) => theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 10px;
  margin-left: 20px;
`;
export const CursoAddData = ({ initialData = {}, refInputData }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const onChangeName = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    setData((dt) => ({ ...dt, name: value }));
  };

  const onDaysToExpire = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    if (value < 0) return;
    setData((dt) => ({ ...dt, daysToExpire: value }));
  };

  const onDuration = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    if (value < 0) return;
    setData((dt) => ({ ...dt, duration: value }));
  };

  const onCursoValidation = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    if (value < 0) return;
    setData((dt) => ({ ...dt, cursoValidation: value }));
  };

  const onAccessTimeAfterConclusion = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    if (value < 0) return;
    setData((dt) => ({ ...dt, accessTimeAfter: value }));
  };

  const onChangeAnswerEmail = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    setData((dt) => ({ ...dt, answerEmail: value }));
  };

  const onChangeCertificationEmail = ({ target }) => {
    dispatch({ type: 'TO_SAVE' });
    const { value } = target;
    setData((dt) => ({ ...dt, certificationEmail: value }));
  };

  const handleChange = (event) => {
    dispatch({ type: 'TO_SAVE' });
    setData((dt) => ({ ...dt, validSignature: true }));
  };

  const handleChangeFalse = (event) => {
    dispatch({ type: 'TO_SAVE' });
    setData((dt) => ({ ...dt, validSignature: false }));
  };

  useImperativeHandle(refInputData, () => {
    return data;
  });

  return (
    <>
      <InputEnd
        labelWidth={100}
        label="Nome do Curso"
        icon="Info"
        name="name"
        width={'100%'}
        variant="outlined"
        value={data?.name ?? ''}
        onChange={onChangeName}
        title="Aqui voc?? deve informar o nome do curso"
        // inputProps={{style: {textTransform: 'capitalize'}}}
        status="Normal"
        validation
      />
      <Label>
        Para validar o curso ?? necess??rio que a assinatura seja certificada
      </Label>
      <div>
        <FormLabel
          control={
            <Checkbox
              checked={data?.validSignature ?? false}
              onChange={handleChange}
              name="validSignature"
              color="primary"
            />
          }
          label="SIM"
        />
        <FormLabel
          control={
            <Checkbox
              checked={!data?.validSignature ?? true}
              onChange={handleChangeFalse}
              name="_validSignature"
              color="primary"
            />
          }
          label="N??O"
        />
      </div>
      <InputEnd
        labelWidth={320}
        label="Email responsavel por responder perguntas"
        icon="Info"
        name="answerEmail"
        width={data?.validSignature ? '50%' : '100%'}
        style={{ marginRight: data?.validSignature ? 20 : 0 }}
        variant="outlined"
        value={data?.answerEmail ?? ''}
        onChange={onChangeAnswerEmail}
        title="Aqui voc?? deve informar o email que ficar?? responsavel por receber notifica????es de duvidades dos alunos sobre o curso"
        status="Normal"
        validation
      />
      {data?.validSignature && (
        <InputEnd
          labelWidth={320}
          label="Email responsavel por assinar o certificado"
          icon="Info"
          name="certificationEmail"
          width={'50%'}
          variant="outlined"
          value={data?.certificationEmail ?? ''}
          onChange={onChangeCertificationEmail}
          title="Aqui voc?? deve informar o email que ficar?? responsavel por assinar o certificado"
          status="Normal"
          validation
        />
      )}
      <InputEnd
        labelWidth={115}
        label="Dias at?? expirar"
        style={{ marginRight: 20, marginBottom: 10 }}
        width={'25%'}
        name="daysToExpire"
        icon="Info"
        variant="outlined"
        value={data?.daysToExpire ?? ''}
        onChange={onDaysToExpire}
        title="Aqui voc?? deve informar o n??mero m??ximo de dias que o aluno ir?? ter para finalizar o curso ap??s inicia-lo. Coloque '0' para nunca expirar"
        status="Normal"
        validation
        inputComponent={NumberDays}
      />
      <InputEnd
        labelWidth={70}
        label="Dura????o"
        width={'25%'}
        style={{ marginRight: 20, marginBottom: 10 }}
        icon="Info"
        name="duration"
        variant="outlined"
        value={data?.duration ?? ''}
        onChange={onDuration}
        title="Aqui voc?? deve informar o n??mero aproximado de horas para se realizar o curso"
        status="Normal"
        validation
        // type="number"
        inputComponent={NumberHours}
      />
      <InputEnd
        labelWidth={180}
        label="Acesso ap??s conclus??o"
        width={'25%'}
        icon="Info"
        name="accessTimeAfter"
        variant="outlined"
        value={data?.accessTimeAfter ?? ''}
        style={{ marginRight: 20, marginBottom: 10 }}
        onChange={onAccessTimeAfterConclusion}
        title="Aqui voc?? deve informar o n??mero aproximado de dias para se o aluno ter acesso ao curso ap??s conclus??o. Coloque '0' para ter acesso vital??cio"
        status="Normal"
        validation
        // type="number"
        inputComponent={NumberDays}
      />
      <InputEnd
        labelWidth={180}
        label="Validade do certificado"
        width={'25%'}
        icon="Info"
        name="cursoValidation"
        variant="outlined"
        value={data?.cursoValidation ?? ''}
        onChange={onCursoValidation}
        title="Aqui voc?? deve informar o n??mero de meses que o certificado ?? v??lido ap??s conclus??o do curso. Coloque '0' para que o certificado n??o possua validade"
        status="Normal"
        validation
        // type="number"
        inputComponent={NumberMonths}
      />
    </>
  );
};
