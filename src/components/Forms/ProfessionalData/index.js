import React, {useState} from 'react';
import {InputsContainer} from '../../Dashboard/Components/Standard/PageCarousel'
import {InputUnform} from '../../Main/MuiHelpers/Input'
import {FormContainer,ButtonForm} from '../../Dashboard/Components/Form/comp'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import styled, {css} from "styled-components";
import { BsInfoCircle } from 'react-icons/bs';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { CropSignature } from './crop';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import { useNotification } from '../../../context/NotificationContext';

const ImageIcon = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 1.2rem;
  gap:20px;
  border: 2px dashed ${({theme})=>theme.palette.background.line};
  border-radius:10px;
  padding:4px;
  svg {
    font-size:60px;
  }

  ${(props) =>
    props.image &&
      css`
        width:fit-content;
        border: 2px dashed ${({theme})=>theme.palette.background.line};
        background-color: #eee;
        padding:6px 20px;
    `}
`;

const ImageSignature = styled.img`
  max-width: 300px;
  object-fit: cover;
  height:60px;
  resize:cover;
  align-self:center;
`;

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

  const formRef = React.useRef()
  const cropRef = React.useRef()

  const [curriculum, setCurriculum] = useState(unform?.curriculum?unform.curriculum:[''])
  const [signatureURL, setSignatureURL] = useState(unform?.signatureURL?unform.signatureURL:'')
  const [open, setOpen] = useState(unform?.signatureURL?unform.signatureURL:'')

  const notification = useNotification()


  const validation = Yup.object({
    resume: Yup.string().required('Nome não pode estar em branco.'),
    // rg: Yup.string().trim().required('RG não pode estar em branco.'),
  })

  const handleSubmit = React.useCallback(async (formData) => {
    formRef.current.setErrors({})
    try {
      await validation.validate(formData, { abortEarly: false })
      if (!signatureURL) return notification.warn({message:'É necessário que você insira sua assinatura para continuar'})
      const array = []
      Object.keys(formData).sort((a, b) => a - b).map(key=>{
        !['LinkedIn','Instagram','Facebook','social','resume'].includes(key) && formData[key] && array.push(formData[key])
      })
      setUnform({...unform, resume:formData.resume, social:formData?.social, curriculum:array, signatureURL})
    } catch (error) {
      const errors = {}
      error?.inner?.forEach((err) => {
        errors[err.path] = err.message
      })
      formRef.current?.setErrors(errors)
    }
  }, [unform, signatureURL])


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

  const handleOnClose = ()=> {
    setOpen(!open);
  };

  return(
    <InputsContainer>
      <FormContainer
        noValidate
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
          inputProps={{style: {color:'#000'}}}
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
        <div style={{display:'flex',alignItems:'center',gap:20,width:'100%'}}>
          <p>Assinatura</p>
          <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={'Inserir sua assinatura para que possa ser incluida nos certificados'} styletooltip={{transform: 'translateY(0px)'}}>
            <div>
                <IconEnd/>
            </div>
          </BootstrapTooltip>
        </div>

        <ImageIcon image={signatureURL}>
          {signatureURL ?
            <>
              <ImageSignature
                src={signatureURL}
              />
            </>
          :
            <>
              <WallpaperIcon fontSizeInherit/>
              Nenhuma Imagem
            </>
          }
        </ImageIcon>
        <p style={{ width:'100%',marginTop:-10,padding:0,marginBottom:5 }}>
          verifique se a assinatura está bem posicionada e totalmente visível na imagem a cima.
        </p>
        <ButtonForm
          type='button'
          onClick={()=>setOpen(true)}
          ButtonForm mt={-5}
          justify='flex-start'
          primary={'true'}
          style={{width:'fit-content', alignItems:'center'}}
        >
          Adicionar Assinatura
        </ButtonForm>


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
          defaultValue={unform?.social?.LinkedIn}
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
      <CropSignature setSignatureURL={setSignatureURL} open={open} handleOnClose={handleOnClose} signatureURL={signatureURL} cropRef={cropRef} />
    </InputsContainer>
  )
}
