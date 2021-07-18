import React, {useState} from 'react';
import {InputsContainer} from '../../Dashboard/Components/Standard/PageCarousel'
import {InputUnform} from '../../Main/MuiHelpers/Input'
import {FormContainer,ButtonForm} from '../../Dashboard/Components/Form/comp'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import {keepOnlyNumbers} from '../../../helpers/StringHandle';
import styled from "styled-components";
import { BsInfoCircle } from 'react-icons/bs';
import { TextArea } from '../../Main/MuiHelpers/TextArea';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const EndIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  /* background-color: ${({theme})=> theme.palette.text.primary }; */
  color: ${({theme})=> theme.palette.status.successD };

  &:hover {
    filter: brightness(0.95);
  }

  cursor:pointer;
`;


export const IconEnd = styled(BsInfoCircle)`
    cursor:pointer;
    color: ${({theme})=> theme.palette.text.primary };
    /* ${props => props.status === 'Normal' && css`
        color: ${({theme})=> theme.palette.text.primary };
    `} */
`;

export const Delete = styled(DeleteOutlineIcon)`
    color: ${({theme})=> theme.palette.status.failD };
`;

export function ProfessionalData({ setUnform,unform}) {

  const [curriculum, setCurriculum] = useState(unform?.curriculum?unform.curriculum:[''])

  const formRef = React.useRef()

  const validation = Yup.object({
    resume: Yup.string().required('Nome não pode estar em branco.'),
    // rg: Yup.string().trim().required('RG não pode estar em branco.'),
  })

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    try {
      await validation.validate(formData, { abortEarly: false })
      const array = []
      Object.keys(formData).sort((a, b) => a - b).map(key=>{
        !['LinkedIn','Instagram','Facebook','social','resume'].includes(key) && formData[key] && array.push(formData[key])
      })
      setUnform({...unform,resume:formData.resume,curriculum:array})
      console.log('submitted: ', formData,{resume:formData.resume,curriculum:array})
    } catch (error) {
      const errors = {}
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform])


  function handleAddCurriculum() {
    const array = []
    const allData = formRef.current.getData();
    Object.keys(allData).sort((a, b) => a - b).map(key=>{
      !['LinkedIn','Instagram','Facebook','social','resume'].includes(key) && array.push(allData[key])
    })
    setCurriculum([...array,''])
  }

  function handleDeleteCurriculum(index) {
    const allData = formRef.current.getData();

    const array = []
    Object.keys(allData).sort((a, b) => a - b).map(key=>{
      !['LinkedIn','Instagram','Facebook','social','resume'].includes(key) && array.push(allData[key])
    })

    array.splice(index, 1);
    setCurriculum([...array])
  }

  return(
    <InputsContainer>
      <FormContainer
        noValidate
        key={curriculum}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <InputUnform
          width={'100%'}
          name={'resume'}
          labelWidth={150}
          label={'Resumo Profissional'}
          defaultValue={unform?.resume}
          multiline
          variant="outlined"
          inputProps={{style: {textTransform: 'capitalize',color:'#000'}}}
        />
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <p>Curriculo Adcional</p>
          <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={'Inserir formação profissional, cursos de relevância, certificações...'} styletooltip={{transform: 'translateY(0px)'}}>
            <div>
                <IconEnd/>
            </div>
          </BootstrapTooltip>
        </div>
        <div style={{display:'flex',flexDirection:'column',width:'100%'}}>
          {curriculum.map((item,index)=>{
            return (
              <InputUnform
                width={'100%'}
                name={`${index}`}
                key={`${index}`}
                defaultValue={item}
                labelWidth={80}
                label={'Curriculum'}
                variant="outlined"
                inputProps={{style: {color:'#000'}}}
                endComponent={()=>
                  <EndIcon onClick={index==curriculum.length-1?handleAddCurriculum:()=>handleDeleteCurriculum(index)}>
                    {index==curriculum.length-1?
                      <AddIcon style={{fontSize:20}}/>
                    :
                      <Delete style={{fontSize:20}}/>
                    }
                  </EndIcon>
                }
              />
            )
          })}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <p>Redes Sociais</p>
          <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={'Inserir URL das redes sociais que deseja disponibilizar.'} styletooltip={{transform: 'translateY(0px)'}}>
            <div>
                <IconEnd/>
            </div>
          </BootstrapTooltip>
        </div>
        <InputUnform
          width={'100%'}
          name={'social.facebook'}
          labelWidth={70}
          defaultValue={unform?.social?.facebook}
          label={'Facebook'}
          statusStart={'Facebook'}
          variant="outlined"
          inputProps={{placeholder:'https://www.facebook.com/realiza.conecta',style: {color:'#000'}}}
          iconStart={'Facebook'}
        />
        <InputUnform
          width={'100%'}
          name={'social.instagram'}
          labelWidth={75}
          defaultValue={unform?.social?.instagram}
          statusStart={'Instagram'}
          label={'Instagram'}
          iconStart={'Instagram'}
          variant="outlined"
          inputProps={{placeholder:'https://www.instagram.com/realiza.conecta',style: {color:'#000'}}}
        />
        <InputUnform
          width={'100%'}
          name={'social.LinkedIn'}
          labelWidth={75}
          defaultValue={unform?.social?.instagram}
          statusStart={'LinkedIn'}
          label={'LinkedIn'}
          iconStart={'LinkedIn'}
          variant="outlined"
          inputProps={{placeholder:'https://www.linkedin.com/in/realiza/',style: {color:'#000'}}}
        />
        <ButtonForm type='submit' jusify='center' primary={'true'} style={{width:'fit-content'}}>
          Proximo
        </ButtonForm>
      </FormContainer>
    </InputsContainer>
  )
}
