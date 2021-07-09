import React, {useState} from 'react';
import {InputsContainer} from '../../../Dashboard/Components/Standard/PageCarousel'
import {InputUnform} from '../../MuiHelpers/Input'
import {FormContainer,ButtonForm} from '../../../Dashboard/Components/Form/comp'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {keepOnlyNumbers} from '../../../../helpers/StringHandle';
import { FaUserTie } from 'react-icons/fa';
import styled from "styled-components";
import { FiCamera } from 'react-icons/fi';

const AvatarInput = styled.div`
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    cursor: pointer;
  }
  div {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    background: ${({theme})=>theme.palette.background.default};
    border: 2px solid ${({theme})=>(theme.palette.text.third)};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: ${({theme})=>(theme.palette.primary.main)};
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(-10deg, ${({theme})=>theme.palette.primary.main}, ${({theme})=>theme.palette.primary.light});
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({theme})=>(theme.palette.primary.contrastText)};
    }
    &:hover {
      filter: brightness(0.95);
    }
  }
`;

const ContainerFirst = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
  flex-wrap:wrap;
  justify-content: center;
  gap: 30px;
`;

const PhoneDiv = styled.div`
  padding: 12px 15px;
  border-radius: 4px;
  border: 1px solid #9f9fab99;
  width: 100%;
  margin:10px 0 20px 0;
  position:relative;
  min-width:300px;

  &:after {
  position: absolute;
  text-align: center;
  content: "Celular";
  font-size: 13px;
  top: -9px;
  left: 10px;
  height: 10px;
  width: 50px;
  background-color: #fff;
  color: ${({theme})=>theme.palette.text.secondary};
}
`;

export function PersonalData({ onUploadProfile,setUnform,unform,notification}) {

  const [value, setValue] = useState(unform.cell)

  const formRef = React.useRef()

  const validation = Yup.object({
    name: Yup.string().required('Nome não pode estar em branco.'),
    rg: Yup.string().trim().required('RG não pode estar em branco.'),
  })

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    try {
      await validation.validate(formData, { abortEarly: false })
      if (!value||(value&&value.length<6)) return notification.warn({message:`Número de celular vazio ou inválido.`})
      setUnform({...unform,...formData,cell:value})
      console.log('submitted: ', formData)
    } catch (error) {
      const errors = {}
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform,value])

  const handleAvatarChange = React.useCallback(
    (event) => {
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].size > 2*10**6) return notification.error({message:'Sua imagem não pode ser maior que 2 MB'})
        onUploadProfile(event.target.files[0])
      }
    },
    [],
  );

  function onCLick() {
    document.getElementById('avatarInput').click();
  }
  console.log(unform)
  return(
    <InputsContainer>
      <FormContainer
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <ContainerFirst>
          <AvatarInput >
            {unform?.photoURL ?
              <img onClick={onCLick} src={unform.photoURL} alt={'perfil_photo'} />
            :
              <div onClick={onCLick}>
                <FaUserTie style={{fontSize:130,transform:'translateY(-5px)'}} />
              </div>
            }
            <label htmlFor="avatar" id="avatarInput">
              <FiCamera />
              <input accept="image/*" type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <div style={{width:'100%',displayL:'flex',flex:1}}>
            <InputUnform
              width={'100%'}
              name={'name'}
              labelWidth={120}
              label={'Nome Completo'}
              defaultValue={unform?.name}
              status={'Normal'}
              variant="outlined"
              inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
            />
            <InputUnform
              width={'100%'}
              name={'rg'}
              defaultValue={keepOnlyNumbers(unform?.rg)}
              labelWidth={20}
              label={'RG'}
              variant="outlined"
              inputProps={{style: {color:'#000'}}}
            />
            <PhoneDiv >
              <PhoneInput
                placeholder="Número de celular"
                value={value}
                defaultCountry="BR"
                numberInputProps={{style: {fontSize:15,paddingLeft:3,border:'none',width:'100%'}}}
                onChange={setValue}
              />
            </PhoneDiv>
          </div>
        </ContainerFirst>
        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}
