/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { InputEnd } from '../../../../../Main/MuiHelpers/Input';
import { NumberFormatCPF } from '../../../../../../lib/textMask';

export function UserInfoInputs({ email, data, setData, isUrl}) {

  const handleChange = (value, name) => {
    const newData = { ...data };
    newData[`${email.index}--${name}`] = value;

    setData(newData);
  };


  return (
        <>
          <h2>{isUrl ? 'Link compartilhavel' : 'e-mail'}</h2>
          {!isUrl && <p className="oneLine">{email.value}</p>}
          <InputEnd
            option
            width="100%"
            onChange={({ target }) => handleChange(target.value, 'name')}
            inputProps={{ style: { textTransform: 'capitalize' } }}
            value={data[`${email.index}--name`] ?? ''}
            size="small"
            labelWidth={120}
            label="Nome do aluno"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            variant="outlined"
          />
          <InputEnd
            option
            value={data[`${email.index}--cpf`] ?? ''}
            onChange={({ target }) => handleChange(target.value, 'cpf')}
            labelWidth={30}
            label="CPF"
            variant="outlined"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            inputProps={{
              placeholder: '000.000.000-00',
              style: { textTransform: 'capitalize', color: '#000' },
            }}
            inputComponent={NumberFormatCPF}
          />
        </>
  );
}
