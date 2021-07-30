import React, {useState, useEffect} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import InputSearch from '../../../../Dashboard/Components/Standard/Search';
import {Icons} from '../../../../Icons/iconsDashboard';
import useTimeOut from '../../../../../hooks/useTimeOut';
import styled from "styled-components";
import { useDebounce } from '../../../../../hooks/useDebounceJs';

const FilterComponents = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:0px 0px 0px 0px;
    margin-top:0px;
`;

export function FilterComponent(props) {

  const [search,setSearch] = useState('');

  function onTimeoutFunction(value) {
    if (props.setLoading) props.setLoading(false)
    props.onStop(value)
  }

  const [onDebounce] = useDebounce(onTimeoutFunction,500)

  function onInputSearch(e) {
    if (props.setLoading) props.setLoading(true)
    onDebounce(e.target.value)
    setSearch(e.target.value)
}

  return(
    <FilterComponents style={props?.style??{}}>
      <InputSearch icons={Icons} onInputSearch={onInputSearch} search={search} onCleanSearch={()=>setSearch('')}/>
      {props.children}
    </FilterComponents>
  )
}
