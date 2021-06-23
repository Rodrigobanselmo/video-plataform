import React, { Fragment } from 'react';

import useCalendar from '../../../../../hooks/useCalendar';
import IconButton from '@material-ui/core/IconButton';
import {Icons} from '../../../../Icons/iconsDashboard'
import { darken, fade } from "@material-ui/core/styles";
import styled, {css} from "styled-components";
import {ModalButtons} from '../../../MuiHelpers/ModalButtons'
import {InputDate} from '../../../MuiHelpers/Input'
import { DatePicker } from "@material-ui/pickers";
import {EspecialSelector} from '../../../MuiHelpers/EspecialSelector'
import { CardDiv,ContainerWeekdays,ContainerWeek,Header,Week,CalendarContainer,HourCard } from './styles'
import {NumberFormatCNPJ} from '../../../../../lib/textMask'
import Input from '../../../MuiHelpers/Input'

const HourDiv = styled.div`
  width: 100%;
  height:${1400/216}px;

  ${props => props.quarter && css`
    border-bottom: 1px solid ${({theme})=> theme.palette.background.line};
    margin-left:10px;
  `}

  & div {
    padding:0 5px;
    height:${1400/116}px;
    transform: translateY(-1px);
    font-size:10px;
  }
`;



const aulas = {
  name:'Rodrigo Barbosa Anselmo',
  id:Math.random(),
  '19-5-2021':{
    date:'19-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:00-19:00':{
        space:'free',
        local:'Presencial',
        area:'Nutricionista',
      },
      '12:00-13:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
  '29-5-2021':{
    date:'29-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:00-19:00':{
        space:'free',
        local:'presencial',
        area:'Nutricionista',
      },
      '12:00-13:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
  '22-5-2021':{
    date:'29-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:30-19:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '18:20-18:30':{
        space:'free',
        local:'presencial',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
}


const sortTime = function (a, b) {
  if (parseInt(a.split(':')[0]) > parseInt(b.split(':')[0])) {
      return 1;
  }
  if (parseInt(b.split(':')[0]) > parseInt(a.split(':')[0])) {
      return -1;
  }
  if (parseInt(a.split(':')[1]) > parseInt(b.split(':')[1])) {
    return 1;
}
  if (parseInt(b.split(':')[1]) > parseInt(a.split(':')[1])) {
    return -1;
  }
  return 0;
};

const Calendar = () => {
  const { calendarRows, selectedDate, todayFormatted, daysShort, monthNames, getNextMonth, getPrevMonth } = useCalendar();
  const [selected, setSelected] = React.useState(todayFormatted)
  const [hours, setHours] = React.useState(aulas)
  const [open, setOpen] = React.useState(false)
  const [dateInput, setDateInput] = React.useState(new Date());
  const [hoursSelected, setHoursSelected] = React.useState(1);
  const [minutesSelected, setMinutesSelected] = React.useState(0);

  const getPrevWeek = () => {
    Object.keys(calendarRows).map(key=>{

      if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && calendarRows[parseInt(key)-1]) {
        setSelected(calendarRows[parseInt(key)-1][0].date)
      } else if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && !calendarRows[parseInt(key)-1]) {

        const month = parseInt(calendarRows[3][0].date.split('-')[1])
        const year = parseInt(calendarRows[3][0].date.split('-')[2])

        function getMonth() {
          if (month-1 == 0) return 12
          return (month-1)
        }
        function getYear() {
          if (month-1 == 0) return year-1
          return year
        }

        function onGetLastDay(day) {
          console.log('day',`${day}-${getMonth()}-${getYear()}`)
          setSelected(`${day}-${getMonth()}-${getYear()}`)
        }

        getPrevMonth({week:onGetLastDay})
      }
    })
  }

  const getNextWeek = () => {
    Object.keys(calendarRows).map(key=>{

      if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && parseInt(key) == 5 && calendarRows[6] && calendarRows[6].findIndex( i=>i.classes== '') == -1) {
        const month = parseInt(calendarRows[3][0].date.split('-')[1])
        const year = parseInt(calendarRows[3][0].date.split('-')[2])

        function getMonth() {
          if (month+1 > 12) return 1
          return (month+1)
        }
        function getYear() {
          if (month+1 > 12) return year+1
          return year
        }
        console.log('DAY+WEEK',`1-${getMonth()}-${getYear()}`)
        setSelected(`1-${getMonth()}-${getYear()}`)
        getNextMonth()
      }


        if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && calendarRows[parseInt(key)+1]) {
        setSelected(calendarRows[parseInt(key)+1][0].date)
        // console.log(calendarRows[parseInt(key)+1][0].date)
      } else if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && !calendarRows[parseInt(key)+1]) {
        const month = parseInt(calendarRows[3][0].date.split('-')[1])
        const year = parseInt(calendarRows[3][0].date.split('-')[2])

        function getMonth() {
          if (month+1 > 12) return 1
          return (month+1)
        }
        function getYear() {
          if (month+1 > 12) return year+1
          return year
        }
        console.log('DAY+WEEK',`1-${getMonth()}-${getYear()}`)
        setSelected(`1-${getMonth()}-${getYear()}`)
        getNextMonth()
      }
    })
  }

  const dateClickHandler = date => {
    console.log(date);
  }

  function onAddTime() {
  }

  function onCloseModalAdd() {
    setOpen(false)
  }

  function onDisable() {
    return false
    // if (open == 'del') return false
    // if (hasTitle && title=='') return true
    // if (open == 'edit' && actionsData?.checklistId && data && data.filter(i=>i.title == title.trim()).length == 1 && data.filter(i=>i.title == title.trim())[0].id == actionsData.checklistId) return false
    // if (data && data.filter(i=>i.title == title.trim()).length > 0) return true
   }

  const handleDateChange = (date) => {
    // if (date == null) return setUnform(unform=>({...unform,creation:new Date()}))
    // setUnform(unform=>({...unform,creation:date}))
    setDateInput(date)
  };

  const array = Array.from(Array(216).keys())

  return(
    <CalendarContainer>
      <Header>
        <div style={{display:'flex',alignItems:'center'}}>
          <p style={{marginRight:10}}>{`${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}</p>
          <div>
            <IconButton  size={'small'} style={{marginRight:10}} aria-label={'leftArrowC'} onClick={getPrevWeek}>
                <Icons  style={{fontSize:30}} type={'KeyboardArrowLeft'} />
            </IconButton>
            <IconButton size={'small'} style={{marginRight:-16}} aria-label={'rightArrowC'} onClick={getNextWeek}>
                <Icons style={{fontSize:30}} type={'KeyboardArrowRightIcon'} />
            </IconButton>
          </div>
        </div>
        <div style={{flexDirection:'row',display:'flex'}}>
          <Input
            style={{width:40}}
            onChange={({target})=>setHoursSelected(parseInt(target.value)<0?23:parseInt(target.value)>23?0:parseInt(target.value))}
            title={'Horas'}
            label={'horas'}
            size={'small'}
            type={'number'}
            value={hoursSelected}
            variant="standard"
          />
          <Input
            style={{width:47}}
            onChange={({target})=>setMinutesSelected(parseInt(target.value)<0?59:parseInt(target.value)>59?0:parseInt(target.value))}
            size={'small'}
            label={'minutos'}
            type={'number'}
            value={minutesSelected}
            variant="standard"
          />
        </div>

      </Header>
      {Object.values(calendarRows).map((cols) => {
        if (cols.findIndex( i=>i.date== selected) == -1) return null
        return (
          <Week key={cols[0].date}>
            {cols.map((col,index) => {
              const isToday = col.date === todayFormatted;
              const isSelected = col.date === selected;
              return (
              <ContainerWeek key={col.date} last={index==6}>
                <ContainerWeekdays today={isToday}>
                  <span>{col.value}</span>
                  <p style={{textAlign:'left',paddingLeft:5,fontSize:14,fontWeight:'bold'}} >
                    {daysShort[index]}
                  </p>
                  <p style={{position:'absolute',bottom:2,right:5,fontSize:10}}>{`${monthNames[selectedDate.getMonth()]}`}</p>
                </ContainerWeekdays>
                <div style={{display:'flex',flex:1,maxHeight:1400,flexDirection:'column',overflow:'hidden',position:'relative'}}>
                  {array.map((item,index)=>{
                    const totalMin = (6*60+item*5)/60
                    const hour = Math.trunc(totalMin)
                    const minutes = `${Math.round((totalMin - Math.floor(totalMin))*60)}0`
                    return(
                      <HourDiv quarter={(index) % 6 !== 0 && (index) % 3 === 0} onClick={()=>alert(`${hour}:${minutes.toString().slice(0,2)}`)} key={item} >
                        { (index) % 12 === 0 ?
                          <div>{index*5/60+6}:00</div>
                        : (index) % 6 === 0 &&
                          <div>{index*5/60+6-0.5}:30</div>
                        }
                      </HourDiv>
                    )
                  })}
                  <>
                    {hours && hours[col.date] &&  Object.keys(hours[col.date].time).sort(sortTime).map((dateKey,indexDate) => {
                      const local = hours[col.date].time[dateKey].local;
                      const space = hours[col.date].time[dateKey].space;
                      const cardInitialHour = dateKey.split('-')[0].split(':')[0];
                      const cardInitialMin = dateKey.split('-')[0].split(':')[1];
                      const cardFimHour = dateKey.split('-')[1].split(':')[0];
                      const cardFimMin = dateKey.split('-')[1].split(':')[1];
                      const totalMin = parseInt(cardInitialHour)*60+parseInt(cardInitialMin)-6*60
                      console.log(totalMin)
                      const totalTopDistance = ((totalMin/5)*(1400/216))
                      return (
                        <HourCard
                          style={{height:20,top:totalTopDistance}}
                          online={local=='online'}
                          filll={space=='fill'}
                          toConfirm={space=='toConfirm'}
                          cancel={space=='cancel'}
                          prev={col.classes.includes('in-prev-month')}
                        >
                          <p>{dateKey}</p>
                        </HourCard>
                      )
                    })}
                  </>
                </div>
              </ContainerWeek>
            )
            })}
          </Week>
        )})
      }
      {/* <ModalButtons
        open={Boolean(open)}
        disable={onDisable()}
        onClick={onAddTime}
        onClose={onCloseModalAdd}
        title={'Novo Horário'}
      >

      </ModalButtons> */}
    </CalendarContainer>
  );
}

export default Calendar;
