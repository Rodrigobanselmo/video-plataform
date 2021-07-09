import React, {useState} from 'react';
import {InputsContainer} from '../../../Dashboard/Components/Standard/PageCarousel'
import {InputUnform,SelectedEnd} from '../../MuiHelpers/Input'
import {FormContainer,ButtonForm} from '../../../Dashboard/Components/Form/comp'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import {keepOnlyNumbers, formatCPFeCNPJeCEPeCNAE} from '../../../../helpers/StringHandle';
import useTimeOut from '../../../../hooks/useTimeOut';
import {NumberFormatOnly,NumberFormatCEP,NumberFormatCNPJ,NumberFormatCPF} from '../../../../lib/textMask'
import {estados} from '../../../../constants/geral'
import axios from "axios";
import styled, {css} from "styled-components";

const ButtonType = styled.div`
  width:140px;
  padding: 5px 5px;
  margin: 10px 10px 30px 0;
  border-radius:30px;
  display:flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({theme})=>(theme.palette.text.third)};
  color: ${({theme})=>(theme.palette.text.secondary)};
  cursor: pointer;

  ${props => props.activeButton && css`
    border: none;
    font-weight: bold;
    color: ${({theme})=>(theme.palette.primary.contrastText)};
    background-color: ${({theme})=>theme.palette.primary.main};
    font-size: 14px;
  `}

  &:hover {
    opacity:0.85;
  }

`;

export function CompanyData({ notification,setUnform,unform,onSecondForm}) {

  const initialStateData = {
    cep:'',
    status:'',
    message:'',
    type:'',
  }

  const formRef = React.useRef()
  const [data, setData] = useState(initialStateData)
  const [_key, setKey] = useState('') //dados dos email inseridos nos inputs
  const [onTimeOut,onClearTime] = useTimeOut()

  React.useEffect(() => {
    if (data.status == 'Check') setKey(Math.random())
  }, [unform])

  const yupCompany = unform.company.juridica ? {razao: Yup.string().required('Nome não pode estar em branco.')} : {}

  const validation = Yup.object({
    company: Yup.object({
      ...yupCompany,
      cpfOrCnpj: Yup.string().required('Nome não pode estar em branco.'),
    }),
    address: Yup.object({
      cep: Yup.string().required('Nome não pode estar em branco.'),
      // municipio: Yup.string().required('Nome não pode estar em branco.'),
      // uf: Yup.string().required('Nome não pode estar em branco.'),
    })
  })

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    try {
      await validation.validate(formData, { abortEarly: false })
      onSecondForm({...unform,...formData,companyId:Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,10)})
      window.scrollTo(0, 0);
      console.log('submitted: ', formData)
    } catch (error) {
      console.log('error',error);
      const errors = {}
      console.log('submittedError: ', formData)
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform])

  const onAddCEP = (event) => {
    onClearTime()
    onTimeOut(()=>checkCEP(event.target.value),1000)
    let fullData = {...data}
    if (event.target.value && event.target.value.length > 6) {
      fullData = {...fullData,cep:event.target.value, status:'Load',message:'Carregando...'}
      setData(fullData)
    } else if (fullData.cep){
      fullData = {...fullData, status:'none',message:''}
      setData(fullData)
    }
  }

  const checkCEP = (value) => {
    if (value.length > 7) {
      if (data.cep !== value) {
        setData(data=>({...data,cep:value, status:'Load',message:'Carregando...'}))
        fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setData(data=>({...data,cep:value, status:'Check',message:'Cep válido'}))
          setUnform(unform=>({...unform,address:{...unform.address,
              complemento:data.complemento,
              logradouro:data.logradouro,
              municipio:data.localidade,
              bairro:data.bairro,
              uf:data.uf,
              cep:value
            }
          }))
        });
      }
    }
  }

  const checkCNPJ = (valueRow) => {

    function seeIfExist(params) {
      if (params) {return params}
      else return ''
    }

    if (!unform.company.juridica) return ''
    const value = keepOnlyNumbers(valueRow.target.value)
    console.log( value, value.length)
    if (value && value.length == 14) {
      axios.get(`https://brasilapi.com.br/api/cnpj/v1/{${keepOnlyNumbers(value)}`).then(res=>{
        console.log('res',res)
        // formRef.current.setFieldValue('company.razao', res.data['razao_social']);
          setData(data=>({...data,cep:value, status:'Check',message:'Cep válido'}))
          setUnform(unform=>({...unform,company:{
            ...unform.company,razao:res.data['razao_social'],cpfOrCnpj:res.data['cnpj']
          },address:{...unform.address,
            complemento:seeIfExist(res.data.complemento),
            logradouro:seeIfExist(res.data.logradouro),
            municipio:seeIfExist(res.data.municipio),
            bairro:seeIfExist(res.data.bairro),
            uf:seeIfExist(res.data.uf),
            numero:seeIfExist(res.data['numero']),
            cep:seeIfExist(res.data['cep'])
          }
        }))
      }).catch((error)=>{
        console.log('error',error)
        notification.warn({message:`CNPJ não encontrado na Receita Federal`})
      })
    }
  }


  const checkJur = (target) => {
    setUnform(data=>({...data,company:{juridica:target,cpfOrCnpj:''}}))
  }


  return(
    <InputsContainer style={{maxWidth:800}}>
      <FormContainer
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
        key={_key}
      >
        <p style={{margin:0,width:'100%'}}>Tipo de conta</p>
        <div style={{width:'100%',display:'flex'}}>
          <ButtonType activeButton={unform.company.juridica} onClick={()=>checkJur(true)}>
            Pessoa jurídica
          </ButtonType>
          <ButtonType activeButton={!unform.company.juridica} onClick={()=>checkJur(false)}>
            Pessoa física
          </ButtonType>
        </div>
        <InputUnform
          // width={unform.company.juridica?'100%':'100%'}
          formstyle={{display:'flex',flex:'1 1 200px'}}
          name={'company.cpfOrCnpj'}
          onChange={checkCNPJ}
          labelWidth={45}
          defaultValue={unform.company.juridica?unform.company?.cpfOrCnpj?keepOnlyNumbers(unform.company.cpfOrCnpj):'':unform.company?.cpfOrCnpj?keepOnlyNumbers(unform.company.cpfOrCnpj):keepOnlyNumbers(unform?.cpf)}
          label={unform.company.juridica?'CNPJ':'CPF'}
          // style={{marginRight:unform.company.juridica?20:0}}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
          inputComponent={unform.company.juridica?NumberFormatCNPJ:NumberFormatCPF}
        />
        {unform.company.juridica && <InputUnform
          // width={'100%'}
          formstyle={{display:'flex',flex:'3 1 400px'}}
          name={'company.razao'}
          labelWidth={100}
          label={'Razão social'}
          defaultValue={unform.company?.razao?unform.company?.razao:''}
          status={'Normal'}
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />}
        <InputUnform
        formstyle={{display:'flex',flex:'1 1 200px'}}
        // width={'100%'}
        name={`address.cep`}
        defaultValue={keepOnlyNumbers(unform.address?.cep?unform.address.cep:'')}
        labelWidth={33}
        label={'CEP'}
        variant="outlined"
        inputComponent={NumberFormatCEP}
        size={'small'}
        status={data?.status && data.status}
        icon={data?.status && data.status}
        title={data.message}
        validation={(data && data?.status && (data.status === 'Check' || data.status === 'Warn' || data.status === 'Load'))}
        onChange={onAddCEP}
        />
        <InputUnform
          formstyle={{display:'flex',flex:'3 1 400px'}}
          // width={'100%'}
          defaultValue={unform.address?.logradouro}
          name={`address.logradouro`}
          labelWidth={75}
          label={'Logradouro'}
          variant="outlined"
        />
        <InputUnform
          formstyle={{display:'flex',flex:'5 1 400px'}}
          // width={'50%'}
          defaultValue={unform.address?.bairro}
          name={`address.bairro`}
          labelWidth={50}
          label={'Bairro'}
          variant="outlined"
          // style={{marginRight:20}}
        />
        <InputUnform
          formstyle={{display:'flex',flex:'1 1 100px'}}
          // width={'15%'}
          name={`address.numero`}
          defaultValue={unform.address?.numero}
          labelWidth={63}
          label={'Número'}
          variant="outlined"
          // style={{marginRight:20}}
          inputComponent={NumberFormatOnly}
        />
        <InputUnform
          formstyle={{display:'flex',flex:'3 1 200px'}}
          // width={'35%'}
          defaultValue={unform.address?.complemento}
          name={`address.complemento`}
          labelWidth={96}
          label={'Complemento'}
          icon={'Info'}
          variant="outlined"
        />
        <InputUnform
            formstyle={{display:'flex',flex:'1 1 200px'}}
          // width={'calc(80% - 20px)'}
            marginBottom={0}
            marginTop={0}
            defaultValue={unform.address?.municipio}
            name={`address.municipio`}
            labelWidth={70}
            label={'Município'}
            icon={'Info'}
            variant="outlined"
            />
        <SelectedEnd
            width={'90px'}
            labelWidth={25}
            marginBottom={0}
            marginTop={0}
            label={'UF'}
            selected={unform.address?.uf?(estados.findIndex(i=>i===unform.address.uf)+1):1}
            setData={(selected)=>setUnform(data=>({...data,address:{...data.address,uf:selected}}))}
            data={estados}
            variant="outlined"
            />
        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}
