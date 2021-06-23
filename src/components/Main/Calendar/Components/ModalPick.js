import React from 'react';

import useCalendar from '../../../../hooks/useCalendar';
import styled from "styled-components";
import {ModalButtons} from '../../MuiHelpers/ModalButtons'
import {SelectedEnd} from '../../MuiHelpers/Input'
import Checkbox from '@material-ui/core/Checkbox';
import DateWeekDaySelector from '../Components/DateWeekDaySelector'
import {Icons} from '../../../Icons/iconsDashboard'
import {ContinueButton} from '../../MuiHelpers/Button'
import HoursSelection from '../Components/HourSelector'
import WeekDaysSelector from '../Components/WeekDaysSelector'
import {BootstrapTooltip} from '../../MuiHelpers/Tooltip'
import { AddCalendarDate } from '../../../../services/firestoreCalendar'
import {useAuth} from '../../../../context/AuthContext'
import './App.css'
import { useSelector,useDispatch } from 'react-redux'
import {NormalizeData,DifferenceInDays} from '../../../../helpers/DataHandler'
import {v4} from "uuid";
import clone from "clone";
import {useNotification} from '../../../../context/NotificationContext'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const Label = styled(FormControlLabel)`
&&& .MuiFormControlLabel-label	{
  font-size:14px;
}
`;


const TextHour = styled.span`
  margin-right: 6px;
  font-size:16px;
  padding-bottom: 6px;
  display: inline-block;
  border-bottom:1px solid ${({theme})=> theme.palette.text.third };
  opacity:0.7;
  & span {
    font-size:14px;
  }
`;

export default function DateSelection({open,setOpen,onConfirm,dataCard}) {

  const { daysArr } = useCalendar();
  const {currentUser} = useAuth();
  const calendar = useSelector(state => state.calendar)
  // const consultArray = ['Clinico Geral','Neurologista']
  const dispatch = useDispatch()
  const notification = useNotification();

  function onConsultArray() {
    const array = []
    currentUser?.profession && currentUser.profession.map(item=>{
      if (!array.includes(item.activit)) array.push(item.activit)
    })
    return array
  }

  const consultArray = React.useMemo(() => onConsultArray(), [currentUser])


  var time = new Date((new Date()).setHours(0,0,0,0));
  var newDate = new Date((new Date()).setHours(0,0,0,0));
  newDate.setDate(time.getDate() + 28);

  const [value, setValue] = React.useState('only');

  const [dateInput, setDateInput] = React.useState(new Date(dataCard.date));
  const [dateInputEnd, setDateInputEnd] = React.useState(dataCard.time.dateEnd?new Date(dataCard.time.dateEnd):newDate);
  const [reptAfter, setReptAfter] = React.useState(1);
  const [numberOfConsults, setNumberOfConsults] = React.useState(1);
  const [localType, setLocalType] = React.useState(dataCard.time.local);
  const [consultType, setConsultType] = React.useState(dataCard.time.area?dataCard.time.area:[...consultArray]);
  const [hoursSelected, setHoursSelected] = React.useState(parseInt(dataCard.timeValue.split('-')[0].split(':')[0]));
  const [minutesSelected, setMinutesSelected] = React.useState(parseInt(dataCard.timeValue.split('-')[0].split(':')[1]));
  const [hoursSelectedAtd, setHoursSelectedAtd] = React.useState(parseInt(dataCard.time.consultTime.split(':')[0]));
  const [minutesSelectedAtd, setMinutesSelectedAtd] = React.useState(parseInt(dataCard.time.consultTime.split(':')[1]));
  const [hoursSelectedInt, setHoursSelectedInt] = React.useState(0);
  const [minutesSelectedInt, setMinutesSelectedInt] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [checkedB, setCheckedB] = React.useState(false);
  const [numberOfConsultsCheck, setNumberOfConsultsCheck] = React.useState(false);
  const [daysSelected, setDaysSelected] = React.useState([(new Date(dataCard.date)).getDay()]);


  React.useEffect(() => {
    if (value =='all') {
      console.log(dataCard.time.dateEnd,new Date(dataCard.time.dateEnd),dataCard.time.dateEnd)
      setDateInput(dataCard.time.initialDate<new Date((new Date()).setHours(0,0,0,0))?new Date((new Date()).setHours(0,0,0,0)):new Date(dataCard.time.initialDate))
      setHoursSelected(parseInt(dataCard.time.initialTime.split(':')[0]))
      setMinutesSelected(parseInt(dataCard.time.initialTime.split(':')[1]))
      setDateInputEnd(dataCard.time.dateEnd?new Date(dataCard.time.dateEnd):newDate)
      setHoursSelectedInt(parseInt(dataCard.time.intervalo.split(':')[0]))
      setMinutesSelectedInt(parseInt(dataCard.time.intervalo.split(':')[1]))
      setChecked(dataCard.time.checked)
      setCheckedB(Boolean(dataCard.time.dateEnd))
      setNumberOfConsultsCheck(dataCard.time.numberOfConsultsCheck)
      setDaysSelected(dataCard.time.daysSelected)
      setNumberOfConsults(dataCard.time.numberOfConsults)
      setReptAfter(dataCard.time.reptAfter)
    } else if (value =='only') {
      setHoursSelected(parseInt(dataCard.timeValue.split('-')[0].split(':')[0]))
      setMinutesSelected(parseInt(dataCard.timeValue.split('-')[0].split(':')[1]))
      setChecked(false)
      setNumberOfConsultsCheck(false)
      setCheckedB(false)
      setHoursSelectedInt(0)
      setMinutesSelectedInt(0)
      setDaysSelected([(new Date(dataCard.date)).getDay()])
      setNumberOfConsults(1)
      setReptAfter(1)
    }
  }, [value])

  React.useEffect(() => {
    // const today = new Date((new Date()).setHours(0,0,0,0))
    const todaySelected = new Date(dateInput)
    // if (new Date((new Date((new Date()).setHours(0,0,0,0))).setDate(today.getDate() + 7)) > new Date(dateInput)) {
      if (daysSelected.length == 1 ) {
        const newDate = parseInt(daysSelected[0]) - parseInt(todaySelected.getDay())
        if (newDate == 0) setDateInput(todaySelected)
        if (newDate > 0) setDateInput(new Date(todaySelected.setDate(todaySelected.getDate() + newDate)))
        if (newDate < 0) setDateInput(new Date(todaySelected.setDate(todaySelected.getDate() + newDate + 7)))
        // if (newDate > 0) setDateInput(new Date(today.setDate(today.getDate() + newDate)))
        // if (newDate < 0) setDateInput(new Date(today.setDate(today.getDate() + newDate + 7)))
      } else {
        setDateInput(todaySelected)
      }
    // }
    //setDaysSelected([(new Date()).getDay()])
  }, [daysSelected])

  const typesToSelet = ['1 semana (Toda semana)', '2 semanas (Semana sim, semana não)', '3 semanas', '4 semanas', '5 semanas', '6 semanas']
  const typesToSelet2 = ['1 atendimento', '2 atendimentos', '3 atendimentos', '4 atendimentos', '5 atendimentos', '6 atendimentos', '7 atendimentos', '8 atendimentos', '9 atendimentos', '10 atendimentos', '11 atendimentos', '12 atendimentos']

  const isBetween = (initialCompare,endCompare,initialTime,endTime) => {
    const totalMinInitialCompare = (parseInt(initialCompare.split(':')[0])*60+parseInt(initialCompare.split(':')[1]))
    const totalMinEndCompare = (parseInt(endCompare.split(':')[0])*60+parseInt(endCompare.split(':')[1]))
    const totalMinInitialTime = (parseInt(initialTime.split(':')[0])*60+parseInt(initialTime.split(':')[1]))
    const totalMinEndTime = (parseInt(endTime.split(':')[0])*60+parseInt(endTime.split(':')[1]))

    if (totalMinInitialTime > totalMinInitialCompare && totalMinInitialTime < totalMinEndCompare) { //o--new--o--new
      console.log(1,initialTime,endTime)
      return `${initialCompare}:${endCompare}//${initialTime}:${endTime}`
    }

    if (totalMinEndTime > totalMinInitialCompare && totalMinEndTime < totalMinEndCompare) {//new--o---new---o
      console.log(2,initialTime,endTime)
      return `${initialCompare}:${endCompare}//${initialTime}:${endTime}`
    }

    if (totalMinInitialTime == totalMinInitialCompare && totalMinEndTime == totalMinEndCompare) {//new=o-----o=new
      console.log(3,initialTime,endTime)
      return `${initialCompare}:${endCompare}//${initialTime}:${endTime}`
    }

    if (totalMinInitialTime <= totalMinInitialCompare && totalMinEndTime >= totalMinEndCompare) {//new--o--o---new
      console.log(4,initialTime,endTime)
      return `${initialCompare}:${endCompare}//${initialTime}:${endTime}`
    }


    return false

  }

  const isTimeOverlay = (oldObject,initialTime,endTime) => {
    const overlay = []
    Object.keys(oldObject).map((keyTime)=>{
      const timeFull = keyTime.split('-')
      // if (Boolean(isBetween(timeFull[0],timeFull[1],initialTime,endTime))) {
      //   return true
      // }
      const valueBetween = isBetween(timeFull[0],timeFull[1],initialTime,endTime)
      if (value == 'all' && (dataCard.time?.id && oldObject[keyTime].id != dataCard.time.id || !(dataCard.time?.id))) {
        if (valueBetween) overlay.push(valueBetween)
      } else if (value == 'only' && (dataCard.time?.uid && oldObject[keyTime].uid != dataCard.time.uid || !(dataCard.time?.uid))) {
        console.log()
        if (valueBetween) overlay.push(valueBetween)
      }
    })
    return overlay
  }

  const onAddConsultTime = (initialTime,addedTime,i,position,intervalo) => {

    const inter = (parseInt(intervalo.split(':')[0])*60*position+parseInt(intervalo.split(':')[1])*position)/60
    const totalMinAdded = (parseInt(initialTime.split(':')[0])*60+parseInt(addedTime.split(':')[0])*60*i+parseInt(initialTime.split(':')[1])+parseInt(addedTime.split(':')[1])*i)/60 + inter
    const hour = Math.trunc(totalMinAdded)
    const minutes = `${Math.round((totalMinAdded - Math.floor(totalMinAdded))*60)}`
    return `${hour}:${minutes.length==1?'0':''}${minutes}`
  }

  const createDate = () => {

    var createdDateObject = {};
    var actualTime = new Date(dateInput);
    // var newDateTime = new Date(dateInput);

    const differenceDays = !checkedB ? 7*24 : DifferenceInDays(dateInput,dateInputEnd)
    console.log('differenceDays',differenceDays)

    var numDaysMap = !checked ? 7 : differenceDays //6 meses no inicio
    const timeInitial = `${hoursSelected}:${minutesSelected.length==1?'0':''}${minutesSelected}`
    const timeConsult = `${hoursSelectedAtd}:${minutesSelectedAtd.length==1?'0':''}${minutesSelectedAtd}`
    const intervalo = `${hoursSelectedInt}:${minutesSelectedInt.length==1?'0':''}${minutesSelectedInt}`
    const numConsult = !numberOfConsultsCheck ? 1:numberOfConsults == 1 ? numberOfConsults:typesToSelet2.findIndex(i=>i==numberOfConsults)+1
    const numOfWeeksToRept = !checked ? 1 : reptAfter == 1 ? reptAfter:typesToSelet.findIndex(i=>i==reptAfter)+1
    const uid = v4()

    const overlayArray = []
    var afterDate = new Date(dateInput)
    if (actualTime.getDay() != 0 && checked) {
      actualTime = new Date(afterDate.setDate(actualTime.getDate() - actualTime.getDay()));
      numDaysMap =  numDaysMap + actualTime.getDay()
    }

    for (var i = 0; i < numDaysMap; i++) { //number of days to map

      const add = i==0?0:1
      afterDate = new Date(actualTime.setDate(actualTime.getDate() + add)); //dia em que se adiciona time

      // if (i == 0 && actualTime.getDay() != 0 && checked) {
      //   afterDate = new Date(newDateTime.setDate(actualTime.getDate() - actualTime.getDay()));
      //   numDaysMap =  numDaysMap + actualTime.getDay()
      // }

      if ( (!((Math.ceil(i/7) % numOfWeeksToRept) == 0) || numOfWeeksToRept == 1) && afterDate>=dateInput ) { // verifica se eu repito ou pulo a semana
        if (daysSelected.includes(afterDate.getDay())) { //se o dia da semana foi selecionado (seg-sexta-domingo)
          if (calendar[NormalizeData(afterDate,'date')]) { //se existe esse dia no calendario atual

            var createdTimeObject = {};
            var oldCalendarTime = {...calendar[NormalizeData(afterDate,'date')].time} //pegar time do dia do calendario atual
            oldCalendarTime = clone(oldCalendarTime) //pegar time do dia do calendario atual
            console.log('oldCalendarTime',oldCalendarTime)
            // console.log('first')

            for (var it = 1; it <= numConsult; it++) { //pegar numero de atendimentos e criar horarios
              const consultTimeStart = onAddConsultTime(timeInitial,timeConsult,it-1,it-1,intervalo)
              const consultTimeEnd = onAddConsultTime(timeInitial,timeConsult,it,it-1,intervalo)

              // console.log('overlay',isTimeOverlay(oldCalendarTime,consultTimeStart,consultTimeEnd))
              const overlayValue = isTimeOverlay(oldCalendarTime,consultTimeStart,consultTimeEnd)
              if (overlayValue.length>0) { //me retorna array com horarios overlay
                overlayArray.push({date:afterDate,time:overlayValue})
              }
              const uidHour = v4()

              createdTimeObject[`${consultTimeStart}-${consultTimeEnd}`] = {
                local:localType == 1 ? 'online':localType,
                profession:'',
                area:[...consultType],
                id:uid,
                uid:uidHour,
                dateEnd:(!checkedB || !checked)?false:new Date(dateInputEnd)*1,
                numberOfConsults:numberOfConsultsCheck?numberOfConsults:1,
                reptAfter,
                consultTime:`${hoursSelectedAtd}:${minutesSelectedAtd}`,
                intervalo:`${hoursSelectedInt}:${minutesSelectedInt}`,
                daysSelected,
                checked,
                numberOfConsultsCheck,
                initialTime:`${hoursSelected}:${minutesSelected}`,
                initialDate:dateInput,
              }
              createdTimeObject = {...oldCalendarTime,...createdTimeObject}

            }

            createdDateObject[NormalizeData(afterDate,'date')] = {date:NormalizeData(afterDate,'date'),time:{...createdTimeObject}}

          } else { //se naon existe esse dia no calendario atual
            var createdTimeObject = {};
              // console.log('second')
              for (var it = 1; it <= numConsult; it++) {
                const consultTimeStart = onAddConsultTime(timeInitial,timeConsult,it-1,it-1,intervalo)
                const consultTimeEnd = onAddConsultTime(timeInitial,timeConsult,it,it-1,intervalo)
                const uidHour = v4()
                createdTimeObject[`${consultTimeStart}-${consultTimeEnd}`] = {
                  local:localType == 1 ? 'online':localType,
                  profession:'',
                  area:[...consultType],
                  id:uid,
                  uid:uidHour,
                  dateEnd:(!checkedB || !checked)?false:new Date(dateInputEnd)*1,
                  numberOfConsults:numberOfConsultsCheck?numberOfConsults:1,
                  reptAfter,
                  initialTime:`${hoursSelected}:${minutesSelected}`,
                  consultTime:`${hoursSelectedAtd}:${minutesSelectedAtd}`,
                  intervalo:`${hoursSelectedInt}:${minutesSelectedInt}`,
                  daysSelected,
                  checked,
                  numberOfConsultsCheck,
                  initialDate:dateInput,
                }
              }

            createdDateObject[NormalizeData(afterDate,'date')] = {date:NormalizeData(afterDate,'date'),time:{...createdTimeObject}}

          }
        }
      }

    }

    if (overlayArray.length>0) {
      console.log('overlay',overlayArray)
      return [false,overlayArray]
    }
    return [true,createdDateObject]

  }

  const checkIfIsEdit = (create) => {
    if (dataCard.time?.uid) {

      if (value == 'all') {
        var newCreate = {...calendar}
        newCreate = clone(newCreate)

        // var newCalendar = {...calendar}
        // newCalendar = clone(newCalendar)
        // Object.keys(newCalendar).map(key=>{
        //   if (newCalendar[key]?.time) Object.keys(newCalendar[key].time).map(time=>{
        //     if (newCalendar[key].time[time].id == dataCard.time.id) delete newCalendar[key].time[time]
        //   })
        // })
        Object.keys(newCreate).map(key=>{
          var formatDate = key.split('-')
          var restFormatDate = formatDate.splice(1,1)
          restFormatDate.push(...formatDate)
          formatDate = restFormatDate.join('/')

          if (newCreate[key]?.time && new Date (formatDate)>=new Date((new Date()).setHours(0,0,0,0))) Object.keys(newCreate[key].time).map(time=>{
            if (newCreate[key].time[time].id == dataCard.time.id) delete newCreate[key].time[time]
          })
        })

        // var newCalendarData = {...calendar}
        // Object.keys(calendar).map(dayData=>{
        //   if (dayData?.time) {
        //     Object.keys(dayData.time).map(time=>{
        //       if (dataCard.time?.id && time?.id && time.id === dataCard.time.id) delete newCalendarData[dayData].time[time]
        //     })
        //   }
        // })

        return {...newCreate,...create}
      } else {
        var newCreate = {...calendar}
        newCreate = clone(newCreate)

        Object.keys(newCreate).map(key=>{
          if (newCreate[key]?.time) Object.keys(newCreate[key].time).map(time=>{
            if (newCreate[key].time[time].uid == dataCard.time.uid) delete newCreate[key].time[time]
          })
        })
        return {...newCreate,...create}
      }
    } else {
      return {...calendar,...create}
    }
  }

  function onAddTime(isDelete) {
    if (consultType.length == 0 && !isDelete) return notification.warn({message:'Selecione ao menos um atendimento para confirmar o horário'})

    if (!isDelete&&getFinalHour(hoursSelected*60+minutesSelected,hoursSelectedAtd*60+minutesSelectedAtd,numberOfConsults == 1 ? numberOfConsults:typesToSelet2.findIndex(i=>i==numberOfConsults)+1)[0] >= 24) {
     return notification.warn({message:'Horário de termino do atendimento não pode ser maior que 24 horas'})
    }

    if (onConfirm) onConfirm()

    function checkSuccess(response) {
      var dataUser = {id:currentUser.uid,name:currentUser.name,photoURL:currentUser?.photoURL?currentUser.photoURL:null}
      dispatch({ type: 'CALENDAR_SET', payload: {...response, ...dataUser} })
      dispatch({ type: 'SAVE', payload: true })
    }

    function checkError(error) {
      // setLoadContent(false)
      // setLoaderDash(false)
      // setTimeout(() => {
        // notification.error({message:error,modal:false})
      // }, 600);
    }

    const create = createDate()

    if (create[0] || isDelete) {
      // console.log('DataCreated',checkIfIsEdit(create[1]))
      if (!isDelete) checkSuccess(checkIfIsEdit(create[1]))
      else checkSuccess(checkIfIsEdit({}))
      // onAddCalendarDate(create[1],currentUser,checkSuccess,checkError)
      setOpen(false)
      setHoursSelected((new Date()).getHours())
      setMinutesSelected(0)
      setDateInput(new Date((new Date()).setHours(0,0,0,0)))
      setDaysSelected([(new Date()).getDay()])
    } else {
      notification.modal({
        title: 'Conflito de horários?',
        text:'Os horários que está querendo cadastrar, geram conflito com os já cadastrados, por favor revise-os novamente?',
        rightBnt:'Fechar',
        component:()=>{
          return (
            <div style={{overflow:'auto',maxHeight:'40vh'}}>
              {create[1].map((item,index)=>{
                return (
                  <div key={`${item.date}${index}`} >
                    <p style={{margin:'10px 0 5px 0',fontSize:16}}>Data: {NormalizeData(item.date)}</p>
                    {item.time.map(time=>{
                      return (
                        <p key={time} style={{margin:'5px 0 5px 0',fontSize:15}}>
                          Horário já cadastrado: {time.split('//')[0]}h &nbsp;&nbsp;&nbsp; Horário pretendente: {time.split('//')[1]}h
                        </p>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        },
        open:true,
        type:'inform',
        onClick:()=>{}
      })
    }

    onCloseModalAdd()
  }

  function onCloseModalAdd() {
    setOpen(false)
    setHoursSelected((new Date()).getHours())
    setMinutesSelected(0)
    setDateInput(new Date((new Date()).setHours(0,0,0,0)))
    setDaysSelected([(new Date()).getDay()])
  }

  const handleChangeConsultType = (event,item) => {
    if (!event.target.checked) {
      setConsultType(consult=>[...consult.filter(i=>i!=item)])
    } else {
      setConsultType(consult=>[...consult,item])
    }
  };

  const handleDateChange = (date) => {
    setDateInput(date)
    setDaysSelected([date.getDay()])
  };

  const handleDateChangeEnd = (date) => {
    setDateInputEnd(date)
  };

  function onSelectedDay(dayIndex) {
    if (daysSelected.includes(dayIndex)) {
      setDaysSelected(day=>[...day.filter(i=>i!=dayIndex)])
    } else {
      setDaysSelected(day=>[...day,dayIndex])
    }
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleChangeB = (event) => {
    setCheckedB(event.target.checked);
  };

  const handleNumberOfConsultsCheck = (event) => {
    setNumberOfConsultsCheck(event.target.checked);
  };

  const getFinalHour = (start,end,times) => {

    // if (dataCard.time.endTime) return dataCard.time.endTime

    const inter = ((hoursSelectedInt*60+minutesSelectedInt)*(times-1))/60
    const totalMin = (start+end*times)/60 + inter
    const hour = Math.trunc(totalMin)
    const minutes = `${Math.round((totalMin - Math.floor(totalMin))*60)}`
    return [hour,minutes]
  };

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  const onDelete = () => {
    onAddTime(true)
  };

  return (
    <ModalButtons
      open={Boolean(open)}
      disable={false}
      onClick={onAddTime}
      dontCloseOnConfirm={true}
      onClose={onCloseModalAdd}
      title={'Novo Horário'}
      extraBnt={'Deletar'}
      extraOnClick={onDelete}
      padding={'large'}
  >
    <div style={{backgroundColor:'#fff',padding:0}}>
      {dataCard.time?.uid &&
        <FormControl component="fieldset" style={{marginBottom:15}}>
          <FormLabel style={{fontSize:15}} component="legend">Editar</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChanges}>
            <Label value="only" control={<Radio size='small' color="primary"/>} label="Somente este horário" />
            {(dataCard.time.numberOfConsultsCheck || dataCard.time.checked) && <Label value="all" control={<Radio size='small' color="primary"/>} label="Todos os horários vinculados" />}
          </RadioGroup>
        </FormControl>
      }
      {/* <p style={{fontSize:16,marginBottom:15}}>Selecione uma data</p> */}
      <div style={{flexDirection:'row',marginTop:15,display:'flex',alignItems:'flex-start',maxHeight:'85vh',overflow:'auto',justifyContent:"flex-start"}}>
        <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
          <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
            Tipo de atendimento:
          </span>
          <div style={{maxWidth:'600px',flexDirection:'row',display:'flex',flexWrap:'wrap'}}>
            {consultArray.map(item=>{
              return (
                <div key={item} style={{minWidth:300,flexDirection:'column',marginTop:10,marginBottom:20}}>
                  <Checkbox
                    style={{margin:0,padding:'0 5px 0 0'}}
                    checked={consultType.includes(item)}
                    size='small'
                    onChange={(event)=>handleChangeConsultType(event,item)}
                    name="checkedCs"
                    color="primary"
                  />
                  <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
                    {item}
                  </span>
                </div>
              )
            })

            }
          </div>
        </div>
        {/* <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
          <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
            Local de atendimento:
          </span>
          <div>
            <SelectedEnd
              width={'200px'}
              title={''}
              value={localType == 1 ? localType:['online','presencial'].findIndex(i=>i==localType)+1}
              setData={(selected)=>setLocalType(selected)}
              data={['online','presencial']}
              variant="outlined"
            />
            </div>
        </div> */}
      </div>

      <div style={{flexDirection:'row',display:'flex',alignItems:'center',justifyContent:"flex-start",marginTop:20}}>
        <DateWeekDaySelector
          text={(checked || daysSelected.length>1) ? 'Data de início dos atendimentos':'Data do atendimento'}
          dateInput={dateInput}
          setDateInput={handleDateChange}
          yearShow
        />
        <div style={{marginBottom:0}}>
          <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>Horário de início do atendimento</span>
          <HoursSelection
            setMin={setMinutesSelected}
            setHour={setHoursSelected}
            min={minutesSelected}
            hour={hoursSelected}
          />
        </div>
      </div>

      <WeekDaysSelector onSelectedDay={onSelectedDay} daysSelected={daysSelected}/>

      <div style={{flexDirection:'row',marginTop:20,display:'flex',alignItems:'flex-start',justifyContent:"flex-start"}}>
        <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
          <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
            Tempo estimado de atendimento
          </span>
          <HoursSelection setMin={setMinutesSelectedAtd} setHour={setHoursSelectedAtd} min={minutesSelectedAtd} hour={hoursSelectedAtd}/>
        </div>
        <div style={{flexDirection:'column',marginBottom:0,opacity:0.7}}>
          <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
            Horário de termino do atendimento:
          </span>
          <div style={{flexDirection:'row',marginBottom:0}}>
            <TextHour >
              {getFinalHour(hoursSelected*60+minutesSelected,hoursSelectedAtd*60+minutesSelectedAtd,numberOfConsults == 1 ? numberOfConsults:typesToSelet2.findIndex(i=>i==numberOfConsults)+1)[0]} <span>h</span>
            </TextHour>
            <TextHour style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
              {getFinalHour(hoursSelected*60+minutesSelected,hoursSelectedAtd*60+minutesSelectedAtd,numberOfConsults == 1 ? numberOfConsults:typesToSelet2.findIndex(i=>i==numberOfConsults)+1)[1]} <span>min</span>
            </TextHour>
          </div>
        </div>
      </div>



      <div style={{flexDirection:'row',marginTop:10,display:'flex',alignItems:'flex-start',justifyContent:"flex-start"}}>
        <div style={{minWidth:300,flexDirection:'column',marginTop:15,marginBottom:10}}>
          <Checkbox
            style={{margin:0,padding:'0 5px 0 0'}}
            checked={numberOfConsultsCheck}
            size='small'
            onChange={handleNumberOfConsultsCheck}
            name="numberOfConsultsCheck"
            color="primary"
          />
          <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
            Quantidade de atendimentos
          </span>
          <BootstrapTooltip
            placement="bottom"
            TransitionProps={{ timeout: {enter:500, exit: 50} }}
            styletooltip={{transform: 'translateY(-5px)'}}
            title={`Aqui você podera indicar quantos atendimentos você pretende fazer, como por exemplo: 4 atendimentos de 40 minutos cada, com intervalo de 20 minutos, começando as 8:00h e terminando as 12:00h`}
          >
              <div style={{display:'inline-block', margin:'0px 0 0px 5px',transform: 'translateY(2px)'}}>
                <Icons type={'Info'} />
              </div>
          </BootstrapTooltip>
          {numberOfConsultsCheck &&
          <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
            {/* <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>
              Número de atendimentos:
            </span> */}
            <div>
              <SelectedEnd
                width={'200px'}
                title={''}
                value={numberOfConsults == 1 ? numberOfConsults:typesToSelet2.findIndex(i=>i==numberOfConsults)+1}
                setData={(selected)=>setNumberOfConsults(selected)}
                data={typesToSelet2}
                variant="outlined"
              />
            </div>
          </div>
        }
        </div>
        {numberOfConsultsCheck &&
          <div style={{minWidth:300,marginTop:15,flexDirection:'column',marginBottom:0}}>
            <span style={{zIndex:110,marginBottom:10,display:'inline-block'}}>
              Intervalo entre os atendimentos
            </span>
            <HoursSelection setMin={setMinutesSelectedInt} setHour={setHoursSelectedInt} min={minutesSelectedInt} hour={hoursSelectedInt}/>
          </div>
        }
      </div>

      <div style={{flexDirection:'row',marginTop:10,display:'flex',alignItems:'center',paddingBottom:0,marginBottom:20,justifyContent:"flex-start",
        // borderBottom:checked?'1px solid #00000022':'0px solid #00000055'
      }}>
        <Checkbox
          style={{margin:0,padding:'0 5px 0 0'}}
          checked={checked}
          size='small'
          onChange={handleChange}
          name="checkedB"
          color="primary"
        />
        <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
          Repetir
        </span>
      </div>
      {checked&&
      <div style={{flexDirection:'row',marginTop:15,display:'flex',alignItems:'flex-start',justifyContent:"flex-start"}}>
        <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
          <span style={{zIndex:110,marginBottom:0,display:'inline-block'}}>
            Repetir a cada:
          </span>
          <div>
          <SelectedEnd
            width={'200px'}
            title={''}
            value={reptAfter == 1 ? reptAfter:typesToSelet.findIndex(i=>i==reptAfter)+1}
            setData={(selected)=>setReptAfter(selected)}
            data={typesToSelet}
            variant="outlined"
          />
          </div>
        </div>
        <div style={{flexDirection:'row',display:'flex',alignItems:'center',justifyContent:"flex-start"}}>
          <div style={{flexDirection:'column',marginBottom:0}}>
          <div style={{minWidth:300,flexDirection:'column',marginBottom:0}}>
            <Checkbox
              style={{margin:0,padding:'0 5px 0 0'}}
              checked={checkedB}
              size='small'
              onChange={handleChangeB}
              name="checkedC"
              color="primary"
            />
            <span style={{zIndex:110,marginBottom:0,display:'inline-block',marginTop:0}}>
              Data de término
            </span>
          </div>
          {checkedB &&
            <div>
              <DateWeekDaySelector
                yearShow
                dateInput={dateInputEnd}
                setDateInput={handleDateChangeEnd}
                text=''
              />
            </div>
          }
        </div>
        </div>
      </div>
      }
      {/* <ContinueButton onClick={onDelete} style={{  marginRight:'15px',marginBottom:'-15px',transform:'translateY(2px)'}}>Deletar</ContinueButton> */}
    </div>
  </ModalButtons>
  )
}
