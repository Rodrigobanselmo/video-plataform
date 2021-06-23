import React from 'react'
import WindowTable from '../../../../components/Main/WindowTable'
import {filterObject} from '../../../../helpers/ObjectArray'
import styled from "styled-components";

const TableComponent = React.memo(({rowsCells,loadContent,search,setSelected,selected,handleCellClick}) => {

  console.log(rowsCells)
  const headCells = [
    { id: 'name', label: 'Usuário',minWidth:300,flex:7, type:'user'},
    { id: 'type',  label: 'Tipo',minWidth:220,flex:5},
    { id: 'creation', label: 'Início/Fim',minWidth:220,flex:5, type:'start/end' },
    { id: 'status', align:'center', label: 'Status',minWidth:100,flex:3, type:'status'},
  ];

  const searchParams = ['name','type','email']

  const filterRowCells = []
  rowsCells.map((row)=>{
    if(searchParams[0] && filterObject(row,search,searchParams[0])) filterRowCells.push({...row})
    else if (searchParams[1] && filterObject(row,search,searchParams[1])) filterRowCells.push({...row})
    else if (searchParams[2] && filterObject(row,search,searchParams[2])) filterRowCells.push({...row})
    else if (searchParams[3] && filterObject(row,search,searchParams[3])) filterRowCells.push({...row})
  })

    return (
      <>
      {!loadContent ?
        <div style={{marginBottom:20,paddingBottom:30,position:'relative'}}>
          <WindowTable
            headCells={headCells}
            rowsCells={filterRowCells}
            // setSelected={setSelected}
            // selected={selected}
            handleCellClick={handleCellClick}
            initialOrder={'name'}
            rowSize={60}
          />
        </div>
      :null}
      </>
    )
});

export default TableComponent
