import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import styled, {css} from "styled-components";

export const TextStyledArea = styled.textarea`
  width:100%;
  /* height:${props=>props.type == 'font' ? '220px' :'100%'}; */
  /* height:400px; */
  resize:none;
  padding:12px 8px 24px 8px;
  background-color: ${({theme})=>theme.palette.background.paper};
  color: ${({theme})=>theme.palette.background.secondary};
  box-sizing: border-box;
  font-size:15px;
  border: 1px solid ${({theme})=> theme.palette.background.line };
  /* -webkit-box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.23);
  box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.23); */
  margin:0 0 20px 0;
  border-radius:6px;

  /* ${props => props.error && css`
    border: 1px solid ${({theme})=> theme.palette.background.attention };
  `} */
`;

export function TextArea({ name, ...rest }) {
  const inputRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])
  return (
    <TextStyledArea
      ref={inputRef}
      defaultValue={defaultValue}
      row={5}
      {...rest}
    />
  )
}
