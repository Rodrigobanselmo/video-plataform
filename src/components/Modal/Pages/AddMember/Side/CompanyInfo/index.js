/* eslint-disable react/jsx-curly-newline */
import React, {useState,useEffect} from 'react';
import { InputEnd } from '../../../../../Main/MuiHelpers/Input';
import { NumberFormatCNPJ, NumberFormatCPF } from '../../../../../../lib/textMask';
import { useSellingData } from '../../../../../../context/data/SellingContext';
import { useDebounce } from '../../../../../../hooks/useDebounce';
import { useGetCNPJ } from '../../../../../../services/hooks/http/useGetCNPJ';

const CompanyInfoComp = ({ isUrl=false,fieldEdit, dataUser, setDataUser }) => {

  const { onDebounce } = useDebounce(setDataUser,500,true)
  const [razao, setRazao] = useState('')
  const [cnpj, setCNPJ] = useState('')
  const mutation = useGetCNPJ()


  const handleChange = async(value, field) => {
    const newData = { ...dataUser };
    newData[`${fieldEdit.index}--${field}`] = value;
    if (field === 'razao') setRazao(value)
    if (field === 'cnpj') {
      setCNPJ(value)

      if (value && value.length == 14) {
        const data =  await mutation.mutateAsync(value)
        if (data) newData[`${fieldEdit.index}--company`] = data.company
        if (data) newData[`${fieldEdit.index}--address`] = data.address
        if (data) setRazao(data.company.razao)
      }
    }
    onDebounce(newData)
  };

  useEffect(() => {
    setRazao(dataUser[`${fieldEdit.index}--razao`] ?? '')
    setCNPJ(dataUser[`${fieldEdit.index}--cnpj`] ?? '')
  }, [fieldEdit])


  return (
        <>
          <h2>{isUrl ? 'Link compartilhavel' : 'e-mail'}</h2>
          {!isUrl && <p className="oneLine">{fieldEdit.value}</p>}
          <InputEnd
            option
            width="100%"
            onChange={({ target }) => handleChange(target.value, 'razao')}
            inputProps={{ style: { textTransform: 'capitalize' } }}
            value={razao}
            size="small"
            labelWidth={110}
            label="Razão social"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            variant="outlined"
          />
          <InputEnd
            option
            value={cnpj}
            onChange={({ target }) => handleChange(target.value, 'cnpj')}
            labelWidth={45}
            label="CNPJ"
            variant="outlined"
            validation
            title="Você pode preencher este dado no lugar do aluno ou deixar para que ele preencha quando for se cadastrar"
            inputProps={{
              placeholder: '00.000.000/0000-00',
              style: { textTransform: 'capitalize', color: '#000' },
            }}
            inputComponent={NumberFormatCNPJ}
          />
        </>
  );
};

export const CompanyInfoInputs = React.memo(CompanyInfoComp);
