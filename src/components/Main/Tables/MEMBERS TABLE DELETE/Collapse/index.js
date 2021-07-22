import React, {useState} from 'react'
import styled,{css} from "styled-components";
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PERMISSIONS } from '../../../../../constants/geral';

export const FormLabel = styled(FormControlLabel)`
  color: ${({theme})=>theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const TableCollapse = styled.div`
  width:100%;
  background-color: ${({theme})=>theme.palette.background.paper};
  border-radius:5px;
  padding:10px 30px;
`;

export function CollapseTable({userOpen,user}) {

  return (
    <Collapse unmountOnExit={true} in={user.uid === userOpen?.uid}>
      <TableCollapse>
        <p>Permissões</p>
        {PERMISSIONS.map(permission=>{
          return (
            <FormLabel
              control={
                <Checkbox
                checked={user?.permission && user.permission.map(i=>{ return i==permission.per }).filter(i=>i).length === 0}
                color="primary"
                disableRipple
                />
              }
              label={permission.name}
            />
          )
        })}
      </TableCollapse>
    </Collapse>
  )
}
