import React from 'react';
import styled, {css} from "styled-components";

const CircleDay = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  background-color: ${({theme})=> theme.palette.primary.mainLight };
  justify-content: center;
  border-radius: 20px;
  margin-right: 10px;
  cursor: pointer;

  ${props => props.daySelected && css`
    color: ${({theme})=>theme.palette.primary.contrastText};
    background-color: ${({theme})=> theme.palette.primary.main };
  `}
`;

export default function WeekDaysSelector({onSelectedDay,daysSelected}) {
  return (
    <div style={{flexDirection:'column',display:'flex',marginTop:20}}>
      <span style={{zIndex:110,marginBottom:0,display:'inline-block'}}>
        Dias da semana:
      </span>
      <div style={{flexDirection:'row',display:'flex',alignItems:'center',justifyContent:"flex-start",marginTop:10}}>
        {['S','T','Q','Q','S','S','D'].map((Day,index)=>{
          return (
            <CircleDay key={Day+index} onClick={()=>onSelectedDay([1,2,3,4,5,6,0][index])} daySelected={daysSelected.includes([1,2,3,4,5,6,0][index])}>{Day}</CircleDay>
          )
        })}
      </div>
    </div>
  )
}
