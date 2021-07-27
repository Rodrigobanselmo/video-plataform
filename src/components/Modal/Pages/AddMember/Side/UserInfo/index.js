/* eslint-disable react/jsx-curly-newline */
import React, {useState,useEffect} from 'react';
import { InputEnd } from '../../../../../Main/MuiHelpers/Input';
import { NumberFormatCPF } from '../../../../../../lib/textMask';
import { useSellingData } from '../../../../../../context/data/SellingContext';
import { useDebounce } from '../../../../../../hooks/useDebounce';

const UserInfoComp = ({ isUrl=false,fieldEdit, dataUser, setDataUser }) => {

  const { onDebounce } = useDebounce(setDataUser,500,true)
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')

  const handleChange = (value, field) => {
    const newData = { ...dataUser };
    newData[`${fieldEdit.index}--${field}`] = value;
    onDebounce(newData)
    if (field === 'name') setName(value)
    if (field === 'cpf') setCpf(value)
  };

  useEffect(() => {
    setName(dataUser[`${fieldEdit.index}--name`] ?? '')
    setCpf(dataUser[`${fieldEdit.index}--cpf`] ?? '')
  }, [fieldEdit])


  return (
        <>
          <h2>{isUrl ? 'Link compartilhavel' : 'e-mail'}</h2>
          {!isUrl && <p className="oneLine">{fieldEdit.value}</p>}
          <InputEnd
            option
            width="100%"
            onChange={({ target }) => handleChange(target.value, 'name')}
            inputProps={{ style: { textTransform: 'capitalize' } }}
            value={name}
            size="small"
            labelWidth={120}
            label="Nome do aluno"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            variant="outlined"
          />
          <InputEnd
            option
            value={cpf}
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
};

export const UserInfoInputs = React.memo(UserInfoComp);
