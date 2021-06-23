import React, { useEffect, useContext, useState } from 'react';

import useCalendar from '../../../../hooks/useCalendar';
import IconButton from '@material-ui/core/IconButton';
import {Icons} from '../../../Icons/iconsDashboard'
import NewIconButton from '../../Buttons/NewIconButton'
import { darken, fade } from "@material-ui/core/styles";
import {ModalButtons} from '../../MuiHelpers/ModalButtons'
import Modal from './Modal'
import {InputDate} from '../../MuiHelpers/Input'
import { DatePicker } from "@material-ui/pickers";
import {EspecialSelector} from '../../MuiHelpers/EspecialSelector'
import { CardDiv,ContainerWeekdays,ContainerWeek,Header,Week,CalendarContainer, } from './styles'
import Input, {SelectedEnd} from '../../MuiHelpers/Input'
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
import Checkbox from '@material-ui/core/Checkbox';
import DateWeekDaySelector from '../Components/DateWeekDaySelector'
import HoursSelection from '../Components/HourSelector'
import WeekDaysSelector from '../Components/WeekDaysSelector'
import ModalPick from '../Components/ModalPick'
import { useSelector,useDispatch } from 'react-redux'
import {filterObject} from '../../../../helpers/ObjectArray'
import {BootstrapTooltip} from '../../MuiHelpers/Tooltip'
import {AddUserButton} from '../../Table/comp'
import {ContinueButton} from '../../MuiHelpers/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import styled, {ThemeContext} from "styled-components";
import {onAddCalendarDate, onGetCalendarDate} from './func'
import {useNotification} from '../../../../context/NotificationContext'
import { useAuth } from '../../../../context/AuthContext'

const sortTime = function (a, b) {
  if (parseInt(a.time.split(':')[0]) > parseInt(b.time.split(':')[0])) {
      return 1;
  }
  if (parseInt(b.time.split(':')[0]) > parseInt(a.time.split(':')[0])) {
      return -1;
  }
  if (parseInt(a.time.split(':')[1]) > parseInt(b.time.split(':')[1])) {
    return 1;
}
  if (parseInt(b.time.split(':')[1]) > parseInt(a.time.split(':')[1])) {
    return -1;
  }
  return 0;
};

const initialValue={
  date:new Date(),
  timeValue:`${(new Date()).getHours()}:00-${(new Date()).getHours()+1}:00`,
  time:{
    area: false,
    local:'online',
    dateEnd:false,
    numberOfConsults:1,
    reptAfter:1,
    consultTime:`1:0`,
    intervalo:`0:0`,
    daysSelected:[(new Date()).getDay()],
    checked:false,
    numberOfConsultsCheck:false,
    initialTime:false
  },
}

const Calendar = ({calendarData,specialty}) => {

  const dispatch = useDispatch()
  const { setLoaderDash } = useLoaderDashboard();
  const {currentUser} = useAuth();
  const notification = useNotification();

  const { calendarRows, selectedDate, todayFormatted, daysShort, monthNames, getTodayMonth, getNextMonth, getPrevMonth } = useCalendar();
  const [selected, setSelected] = useState(todayFormatted)
  const [search, setSearch] = useState('')
  const [filterSpecial, setFilterSpecial] = useState([])

  const theme = useContext(ThemeContext)



  const getPrevWeek = () => {
    Object.keys(calendarRows).map(key=>{

      if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && calendarRows[parseInt(key)-1]) {
        setSelected(calendarRows[parseInt(key)-1][0].date)
      } else if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && !calendarRows[parseInt(key)-1]) {

        const month = parseInt(calendarRows[3][0].date.split('-')[1])
        const year = parseInt(calendarRows[3][0].date.split('-')[2])

        function getDay() {
          if (calendarRows[1][0].classes != '') return (calendarRows[1][0].value-1)
          return false
        }
        function getMonth() {
          if (month-1 == 0) return 12
          return (month-1)
        }
        function getYear() {
          if (month-1 == 0) return year-1
          return year
        }

        function onGetLastDay(day) {
          const actual = getDay();
          setSelected(`${actual?actual:day}-${getMonth()}-${getYear()}`)
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

        function getDay() {
          if (calendarRows[5][6].classes != '') return (calendarRows[5][6].value+1)
          return 1
        }
        function getMonth() {
          if (month+1 > 12) return 1
          return (month+1)
        }
        function getYear() {
          if (month+1 > 12) return year+1
          return year
        }
        setSelected(`${getDay()}-${getMonth()}-${getYear()}`)
        getNextMonth()
      }


        if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && calendarRows[parseInt(key)+1]) {
        setSelected(calendarRows[parseInt(key)+1][0].date)
      } else if (calendarRows[key].findIndex( i=>i.date== selected) != -1 && !calendarRows[parseInt(key)+1]) {
        const month = parseInt(calendarRows[3][0].date.split('-')[1])
        const year = parseInt(calendarRows[3][0].date.split('-')[2])

        function getDay() {
          if (calendarRows[6][6].classes != '') return (calendarRows[6][6].value+1)
          return 1
        }
        function getMonth() {
          if (month+1 > 12) return 1
          return (month+1)
        }
        function getYear() {
          if (month+1 > 12) return year+1
          return year
        }
        setSelected(`${getDay()}-${getMonth()}-${getYear()}`)
        getNextMonth()
      }
    })
  }

  const getToday = () => {
    setSelected(todayFormatted)
    getTodayMonth()
  }


  function formatDate(date) {
    var formatDate = date.split('-')
    var restFormatDate = formatDate.splice(1,1)
    restFormatDate.push(...formatDate)
    formatDate = restFormatDate.join('/')
    return new Date(formatDate)
  }

  const editCard = (data) => {
    // const date = formatDate(data.date.date)

    // if (date<(new Date((new Date()).setHours(0,0,0,0)))) return null

    // const newDate = {
    //   date,
    //   timeValue:data.time,
    //   time: data.date.time[data.time]
    // }
    // // setDataCard(newDate)
  }

  function onGetDayCalendar(colDate) {
    const array = []
    Object.keys(calendarData).map(keyUid=>{
      calendarData[keyUid][colDate] && Object.keys(calendarData[keyUid][colDate].time).map(time=>{
        specialty
        const hasArea = calendarData[keyUid][colDate].time[time].area.filter(i=>specialty.includes(i)).length
        if (hasArea>0) array.push({...calendarData[keyUid][colDate].time[time],time,name:calendarData[keyUid].name,photoURL:calendarData[keyUid].photoURL})
      })
    })
    return array
  }


  // var text = {
  //   "allItemsAreSelected": "Todo os filtros foram selecionados",
  //   "noOptions": "Nenhuma opção",
  //   "search": "Pesquisar...",
  //   "selectAll": "Selecionar Todos",
  //   "select": "Filtros selecionados",
  //   "selectSomeItems": "Filtrar por especialidade..."
  // }


  return(
    <>
    <CalendarContainer>
      <Header>
        <div style={{display:'flex',alignItems:'center'}}>
          <div>
            <IconButton  size={'small'} style={{marginRight:0,marginLeft:-5}} aria-label={'leftArrowC'} onClick={getPrevWeek}>
                <Icons  style={{fontSize:35}} type={'KeyboardArrowLeft'} />
            </IconButton>
          <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={'Hoje'} styletooltip={{transform: 'translateY(0px)'}}>
              <IconButton  size={'small'} style={{marginRight:-2}} aria-label={'Calendar'} onClick={getToday}>
                  <Icons  style={{fontSize:22}} type={'Calendar'} />
              </IconButton>
          </BootstrapTooltip>
            <IconButton size={'small'} style={{marginRight:16,marginLeft:0}} aria-label={'leftArrow'} onClick={getNextWeek}>
                <Icons style={{fontSize:35}} type={'KeyboardArrowRightIcon'} />
            </IconButton>
          </div>
          <p style={{marginRight:10,minWidth:120}}>{`${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}</p>
          {/* <AddUserButton onClick={onAddButton} text={'Novo horário'} icon={'Add'} width={160} /> */}

          {/* <EspecialSelector
            override={text}
            // inputStyle={'true'}
            // selectedValue={unform.bankAccount?.name}
            hideSelectAll
            width={'100%'}
            onSelectFunction={setFilterSpecial}
            onSearch={setSearch}
            options={(specialty?specialty.filter(i=> (search == '' || filterObject(i,search,'text') || filterObject(i,search,'name') )).slice(0,20):[])}
          /> */}

        </div>
        {/* <NewIconButton
          onClick={()=>setOpen(true)}
        /> */}
        {/* <div style={{position: 'relative'}}>
          <ContinueButton disable={`${loading || !save}`} style={{width:100,padding:2.5,opacity:loading?0.6:1}} onClick={onSave} primary={!save?'outlined':'true'} size={'medium'}>
            Salvar
          </ContinueButton>
          {loading && <CircularProgress size={24} style={{color: theme.palette.primary.main,position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}} />}
        </div> */}

      </Header>
      {Object.values(calendarRows).map((cols) => {
        if (cols.findIndex( i=>i.date== selected) == -1) return null
        return (
          <Week key={cols[0].date}>
            {cols.map((col,index) => {
              const calendarArray = onGetDayCalendar(col.date) //diminui sabado e domingo
              const isToday = col.date === todayFormatted;
              const isOldDay = (parseInt(col.date.split('-')[0])/10+parseInt(col.date.split('-')[1])*10+parseInt(col.date.split('-')[1])*1000) < (parseInt(todayFormatted.split('-')[0])/10+parseInt(todayFormatted.split('-')[1])*10+parseInt(todayFormatted.split('-')[1])*1000)
              const toHide = (index==6||index==5)&&!(calendarArray.length > 0) //diminui sabado e domingo
              return (
              <ContainerWeek key={col.date} oldDay={isOldDay} last={index==6} hide={toHide}>
                <ContainerWeekdays oldDay={isOldDay} today={isToday}>
                  <span>{col.value}</span>
                  <p style={{textAlign:'left',paddingLeft:5,fontSize:14,fontWeight:'bold'}} >
                    {daysShort[index]}
                  </p>
                  {!toHide&&<p style={{position:'absolute',bottom:2,right:5,fontSize:10}}>{`${monthNames[selectedDate.getMonth()]}`}</p>}
                </ContainerWeekdays>
                {calendarArray.sort(sortTime).map((item,indexDate) => {
                  // let isReturn = false
                  // specialty.map(i=>{
                  //   if (!item.area.includes(i)) isReturn = true
                  // })
                  // if (isReturn) return null
                  const local = item.local
                  const name = item.name
                  const space = false
                  const data = {date:col.date,time:item.time}
                  return (
                    <CardDiv
                      onClick={()=>editCard(data)}
                      key={item.uid}
                      online={local=='online'}
                      photo={item?.photoURL}
                      filll={space=='fill'}
                      toConfirm={space=='toConfirm'}
                      cancel={space=='cancel'}
                      prev={formatDate(col.date)<new Date((new Date()).setHours(0,0,0,0))}
                      // prev={col.classes.includes('in-prev-month')}
                    >
                      <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <p style={{marginRight:'auto'}}>{item.time}</p>
                        {item?.photoURL&&<img style={{height:30,width:30,borderRadius:'50%'}} resizeMode='cover' src={item?.photoURL} alt={'perfil_photo'} />}
                      </div>
                      <p style={{fontSize:10}}>Atendimento {local}</p>
                      <p style={{fontSize:10}}>{name}</p>
                      {/* <p style={{position:'absolute',bottom:3,right:5,fontSize:10}}>
                        {space=='fill'?'ocupado':space=='toConfirm'?'aguardando':space=='free'?'Livre':'cancelado'}
                      </p> */}
                    </CardDiv>
                  )
                })}
              </ContainerWeek>
            )
            })}
          </Week>
        )})
      }
        {/* <Modal open={open} setOpen={setOpen}/> */}
    </CalendarContainer>
    </>
  );
}

export default Calendar;
