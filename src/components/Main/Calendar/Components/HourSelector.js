import { DatePicker } from "@material-ui/pickers";
import styled, {css} from "styled-components";
import Input from '../../MuiHelpers/Input'
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 80,
  },
}));

export default function TimePickers({min,setMin,hour,setHour,text}) {
  const classes = useStyles();

  const onTime = (value) => {
    setHour(parseInt(value.split(':')[0]))
    setMin(parseInt(value.split(':')[1]))
    console.log(parseInt(value.split(':')[0]))
    console.log(parseInt(value.split(':')[1]))
  }

  // console.log(`${hour.toString().length==1?'0':''}${hour}:${min.toString().length==1?'0':''}${min}`)

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        type="time"
        className={classes.textField}
        value={`${hour.toString().length==1?'0':''}${hour}:${min.toString().length==1?'0':''}${min}`}
        onChange={(e)=>onTime(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

// export default function HoursSelection({min,setMin,hour,setHour}) {
//   return (
//     <div style={{flexDirection:'row',display:'flex',alignItems:'center',justifyContent:"flex-start", width:90}}>
//       <Input
//         style={{width:35}}
//         className={'hour'}
//         onChange={({target})=>setHour(parseInt(target.value)<0?23:parseInt(target.value)>23?0:parseInt(target.value))}
//         title={'Horas'}
//         size={'small'}
//         type={'number'}
//         value={hour}
//         variant="standard"
//       />
//       <Input
//         style={{width:48}}
//         onChange={({target})=>setMin(parseInt(target.value)<0?59:parseInt(target.value)>59?0:parseInt(target.value))}
//         className={'min'}
//         size={'small'}
//         type={'number'}
//         value={min}
//         variant="standard"
//       />
//     </div>
//   )
// }
