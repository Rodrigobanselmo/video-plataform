import { DatePicker } from "@material-ui/pickers";
import useCalendar from '../../../../hooks/useCalendar';
import styled, {css} from "styled-components";

const DateRow = styled.div`
  display: flex;
  align-items: center;
  & span {
    font-size:16px;
    transform:translate(-100px, 0px)
  }
`;

export default function DateSelection({dateInput,yearShow,setDateInput,text='Data de início do atendimento'}) {

  const { daysArr } = useCalendar();

  function getMonth(dateInput) {
    if ([10,11].includes(dateInput.getMonth())) return 35
    if ([1].includes(dateInput.getMonth())) return 30
    if ([9,1].includes(dateInput.getMonth())) return 25
    if ([8].includes(dateInput.getMonth())) return 30
    if ([7,0].includes(dateInput.getMonth())) return 17
    if ([5,2].includes(dateInput.getMonth())) return 10
    if ([4].includes(dateInput.getMonth())) return 5
  }

  return (
    <div style={{minWidth:300}}>
      <span style={{zIndex:110,marginBottom:5,display:'inline-block'}}>{text}</span>
      <DateRow>
        <DatePicker
          maxDate={(new Date()).setDate((new Date()).getDate() + 365)}
          style={{width:160+getMonth(dateInput),zIndex:111,textAlign:'center'}}
          disableToolbar
          variant="inline"
          disablePast
          autoOk
          value={dateInput}
          onChange={setDateInput}
        />
        <span style={{zIndex:110}}>{yearShow?`, ${1900+dateInput.getYear()}`:`, ${daysArr[dateInput.getDay()].toLocaleLowerCase()}`}</span>
      </DateRow>
    </div>
  )
}
