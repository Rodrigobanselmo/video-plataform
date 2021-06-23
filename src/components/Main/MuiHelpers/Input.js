import React, {useRef,useEffect,useCallback} from 'react';
import { withStyles } from '@material-ui/core/styles';
import styled, {css} from "styled-components";
import {Icons} from '../../../components/Icons/iconsDashboard'
import TextField from '@material-ui/core/TextField';
import {BootstrapTooltip} from '../../../components/Main/MuiHelpers/Tooltip'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { fade } from '@material-ui/core/styles';
import { useField } from '@unform/core'
import { uniqueId } from 'lodash/util'
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const ContainerIcon = styled.div`
    &:active {
      opacity:0.5;
    }
`;

// <Input key={index} status={emails[index]?.status && emails[index].status} icon={emails[index]?.status && emails[index].status} validation={(emails && emails[index] && emails[index]?.status && (emails[index].status === 'Check' || emails[index].status === 'Warn' || emails[index].status === 'Load'))} onBlur={({target})=>checkEmail(index,target.value)} onChange={addEmail(index)} size={'small'} label="Email" variant="outlined"  />


export const Icon = styled(Icons)`
    position:absolute;
    top:18%;
    right:17px;
    cursor:pointer;
    color: ${({theme})=> theme.palette.status.success };


    ${props => props.status === 'Warn' && css`
        color: ${({theme})=> theme.palette.status.fail };
    `}
    ${props => props.status === 'Load' && css`
        top:11%;
        right:17px;
    `}
    ${props => props.status === 'Normal' && css`
        color: ${({theme})=> theme.palette.text.primary };
    `}
`;
export const IconEnd = styled(Icons)`
    cursor:pointer;
    color: ${({theme})=> theme.palette.status.success };


    ${props => props.status === 'Warn' && css`
        color: ${({theme})=> theme.palette.status.fail };
    `}
    ${props => props.status === 'Load' && css`

    `}
    ${props => props.status === 'Normal' && css`
        color: ${({theme})=> theme.palette.text.primary };
    `}
`;

export const IconStart = styled(Icons)`
    cursor:pointer;
    color: ${({theme})=> theme.palette.text.primary };


    ${props => props.status === 'Facebook' && css`
        color: 	#4267B2;
    `}
    ${props => props.status === 'Instagram' && css`
      color: 	#C13584;
    `}
    ${props => props.status === 'WhatsApp' && css`
      color: 	#34af23;
    `}
    ${props => props.status === 'Normal' && css`
        color: ${({theme})=> theme.palette.text.primary };
    `}
`;

const InputEmail = withStyles((theme) => ({
    root: {
        color: theme.palette.text.primary,
        marginBottom:10,
    },
}))((props) => <TextField {...props} />);

const OutlinedInputEnd = withStyles((theme) => ({
    root: {
        color: theme.palette.text.primary,
    },
    input: {
        padding:"14px 0px 9px 17px",
        transform:'translateY(-2px)'
    },
    marginDense: {
        margin:0,
    },
    disabled: {
      color: fade(theme.palette.text.primary,0.6),
    },
}))(({inpRef,...props}) => <OutlinedInput ref={inpRef} {...props} />);

const SelectEnd = withStyles((theme) => ({
    root: {
        color: theme.palette.text.primary,
        padding:"13px 0px 10px 17px",
    },
}))((props) => <Select {...props} />);

const InputLabelEnd = withStyles((theme) => ({
    root: {
        fontSize:16,
    },
}))((props) => <InputLabel {...props} />);

export default function Input({validation=false,status,icon,width='100%',title='OK',...props}) {

    return (
            <div style={{position:'relative',width:width,display:'flex',flexDirection:'column'}}>
                <InputEmail {...props}  />
                {validation &&
                <BootstrapTooltip placement="right" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={title} styletooltip={{transform: 'translateY(-30px)'}}>
                    <div>
                        <Icon status={status} type={icon}/>
                    </div>
                </BootstrapTooltip>
                }
            </div>
    );
}

export function InputEnd({validation=false,iconStart,titleStart='',statusStart,option=false,marginTop=10,marginBottom=10,labelWidth,label,status,icon,width='100%',title='OK',iconProps,...props}) {

  const startInd = statusStart?{
    startAdornment:(
      <InputAdornment >
        {statusStart=='money'?
          'R$'
        :
        <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={titleStart} styletooltip={{transform: 'translateY(0px)'}}>
            <div>
                <IconStart style={{fontSize:22,transform:'translateY(2px)'}} status={statusStart} type={iconStart}/>
            </div>
        </BootstrapTooltip>
        }
      </InputAdornment>
    )
  }:{}

    return (
        <FormControl style={{width:width,marginTop,marginBottom}} variant="outlined">
          <InputLabelEnd margin={'dense'} htmlFor="outlined-adornment-password" >{label}{option && <span style={{fontSize:10,verticalAlign:'middle',marginLeft:8}}>{option===true?'(OPCIONAL)':`(${option})`}</span>}</InputLabelEnd>
          <OutlinedInputEnd
            margin={'dense'}
            autoComplete={'off'}
            endAdornment={
              <InputAdornment position="end">
                {validation &&
                <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={title} styletooltip={{transform: 'translateY(0px)'}}>
                    <ContainerIcon {...iconProps}>
                        <IconEnd status={status} type={icon}/>
                    </ContainerIcon>
                </BootstrapTooltip>
                }
              </InputAdornment>
            }
            {...startInd}
            labelWidth={labelWidth+(option===true?60:0)}
            {...props}
          />
        </FormControl>
    );
}

export function SelectedEnd({selected,setData,sliceItems=false,label,data=[],marginTop=10,marginBottom=10,status,icon,width='100%',title='',...props}) {

    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
      setData(data[event.target.value - 1])
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    return (
      <BootstrapTooltip disableHoverListener={!Boolean(title)} placement="right" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={title} styletooltip={{transform: 'translateY(-2.5px)'}}>
        <FormControl variant="outlined" style={{width:width,marginTop,marginBottom}} >
            {label&&<InputLabelEnd margin={'dense'} htmlFor="outlined-age-native-simple">{label}</InputLabelEnd>}
            <SelectEnd
            style={{color:'#000'}}
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={selected === 0 ? 1 : selected}
            onChange={handleChange}
            {...props}
            >
            {sliceItems ?
                data.slice(1,sliceItems).map((item,index)=>
                    <MenuItem key={index} value={(index+1)}>{item}</MenuItem>
                )
            :
                data.map((item,index)=>
                    <MenuItem key={index} value={(index+1)}>{item}</MenuItem>
                )
            }
            </SelectEnd>
        </FormControl>
        </BootstrapTooltip>
    );
}

// export function SelectedUnform({selected,name,setData,sliceItems=false,label,data=[],marginTop=10,marginBottom=10,status,icon,width='100%',title='',...props}) {

//     const [open, setOpen] = React.useState(false);

//     const handleClose = () => {
//       setOpen(false);
//     };

//     const handleOpen = () => {
//       setOpen(true);
//     };

//     const fieldRef = useRef()
//     const inputRef = useRef()
//     const errorRef = useRef()

//     const { fieldName, defaultValue, registerField, error } = useField(name)
//     const [id] = React.useState(uniqueId('textfield-Sele'))

//     useEffect(() => {
//       registerField({
//         name: fieldName,
//         ref: inputRef.current,
//         path: 'value',
//       })
//     }, [fieldName, registerField])

//     const setError = useCallback(
//       (error) => {
//         if (error) {
//           if (!errorRef.current.innerHTML) {
//             fieldRef.current.classList.add('Mui-error')
//           }
//           errorRef.current.innerHTML = error
//         } else {
//           if (errorRef.current.innerHTML) {
//             fieldRef.current.classList.remove('Mui-error')
//             errorRef.current.innerHTML = ''
//           }
//         }
//       },
//       [errorRef, fieldRef]
//     )

//     useEffect(() => {
//       setError(error)
//     }, [error, setError])

//     const handleChange = useCallback(
//       (e) => {
//         setError('')
//         if (setData) {
//           setData(data[e.target.value - 1])
//         }
//       },
//       [setData, setError]
//     )

//     return (
//       <BootstrapTooltip disableHoverListener={!Boolean(title)} placement="right" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={title} styletooltip={{transform: 'translateY(-2.5px)'}}>
//         <FormControl variant="outlined" style={{width:width,marginTop,marginBottom}} >
//             {label&&<InputLabelEnd margin={'dense'} htmlFor="outlined-age-native-simple">{label}</InputLabelEnd>}
//             <SelectEnd
//             open={open}
//             defaultValue={defaultValue}
//             id={id}
//             name={name}
//             inpRef={fieldRef}
//             inputRef={inputRef}
//             onChange={handleChange}
//             onClose={handleClose}
//             onOpen={handleOpen}
//             value={selected === 0 ? 1 : selected}
//             {...props}
//             >
//             {sliceItems ?
//                 data.slice(1,sliceItems).map((item,index)=>
//                     <MenuItem key={index} value={(index+1)}>{item}</MenuItem>
//                 )
//             :
//                 data.map((item,index)=>
//                     <MenuItem key={index} value={(index+1)}>{item}</MenuItem>
//                 )
//             }
//             </SelectEnd>
//         </FormControl>
//         </BootstrapTooltip>
//     );
// }

export function InputUnform({onChange,iconStart,statusStart,variant,positionIcon='end',name,validation=false,option=false,titleStart='',marginTop=10,marginBottom=10,labelWidth,label,status,icon,width='100%',title='',...props}) {

  const fieldRef = useRef()
  const inputRef = useRef()
  const errorRef = useRef()

  const { fieldName, defaultValue, registerField, error } = useField(name)
  const [id] = React.useState(uniqueId('textfield-'))

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  const setError = useCallback(
    (error) => {
      if (error) {
        if (!errorRef.current.innerHTML) {
          fieldRef.current.classList.add('Mui-error')
        }
        errorRef.current.innerHTML = error
      } else {
        if (errorRef.current.innerHTML) {
          fieldRef.current.classList.remove('Mui-error')
          errorRef.current.innerHTML = ''
        }
      }
    },
    [errorRef, fieldRef]
  )

  useEffect(() => {
    setError(error)
  }, [error, setError])

  const handleChange = useCallback(
    (e) => {
      setError('')
      if (onChange) {
        onChange(e)
      }
    },
    [onChange, setError]
  )

  const startInd = statusStart?{
    startAdornment:(
      <InputAdornment >
        {statusStart=='money'?
          'R$'
        :
        <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={titleStart} styletooltip={{transform: 'translateY(0px)'}}>
            <div>
                <IconStart style={{fontSize:22,transform:'translateY(2px)'}} status={statusStart} type={iconStart}/>
            </div>
        </BootstrapTooltip>
        }
      </InputAdornment>
    )
  }:{}

  return (
      <FormControl style={{width:width,minWidth:width,marginTop,marginBottom}} variant="outlined">
        <InputLabelEnd margin={'dense'} htmlFor={id} >{label}{option && <span style={{fontSize:10,verticalAlign:'middle',marginLeft:8}}>{option===true?'(OPCIONAL)':`(${option})`}</span>}</InputLabelEnd>
        <OutlinedInputEnd
          autoComplete='off'
          defaultValue={defaultValue}
          id={id}
          name={name}
          inpRef={fieldRef}
          inputRef={inputRef}
          onChange={handleChange}
          margin={'dense'}
          endAdornment={
            <InputAdornment >
              {validation &&
              <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={title} styletooltip={{transform: 'translateY(0px)'}}>
                  <div>
                      <IconEnd status={status} type={icon}/>
                  </div>
              </BootstrapTooltip>
              }
            </InputAdornment>
          }
          {...startInd}
          labelWidth={labelWidth+(option===true?60:0)}
          {...props}
        />
        <FormHelperText style={{margin:4,padding:0,marginLeft:3}} ref={errorRef} error />
      </FormControl>
  );
}

export function InputDate({...props}) {


  return (
      <KeyboardDatePicker
        autoOk
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="dense"
        id="date-picker-inline"
        inputVariant="outlined"
        label="Data de Início"
        invalidDateMessage='Formato de data inválido'
        // value={selectedDate}
        // onChange={handleDateChange}
        InputAdornmentProps={{ position: "start" }}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        style={{width:'100%'}}
        {...props}
      />
  )
}
