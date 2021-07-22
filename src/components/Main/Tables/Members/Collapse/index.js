import React, {useState} from 'react'
import styled,{css} from "styled-components";
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PERMISSIONS } from '../../../../../constants/geral';
import { UserCursosTable } from '../../UserCursos';
import { lighten } from "@material-ui/core/styles";



const Container = styled.div`
  grid-column: 1 / 5;
  width:100%;

`;


const TableCollapse = styled.div`

  width:100%;
  background-color: ${({theme})=>theme.palette.background.paper};
  border-top: 1px solid ${({theme})=>theme.palette.background.line};
  margin: 8px 0 5px 0;
  padding: 12px 0 0 0;
  /* padding:10px 30px; */
`;

const Title = styled.p`
  color: ${({theme})=>theme.palette.text.secondary};
  font-size: 1.1rem;
  font-weight:bold;
  margin-top: ${({mt})=>mt}px;
  margin-bottom: ${({mb})=>mb}px;
`;

const PermissionView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
  padding: 0px 20px;
  margin-top:6px;
  background-color:${({theme})=> lighten(theme.palette.background.default,0.4)};
  border-radius:30px;
`;

const PermissionItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;



export function CollapseTable({userOpen,user}) {

  return (
    <Container>
      <Collapse unmountOnExit={true} in={user.uid === userOpen?.uid}>
        <TableCollapse>
          { user.access === 'admin' &&
            <>
              <Title>Permissões</Title>
              <PermissionView>
                {PERMISSIONS.map(permission=>{
                  return (
                    <PermissionItem>
                      <p>{permission.name}</p>
                      <Checkbox
                        size='small'
                        checked={user?.permission && user.permission.map(i=>{ return i==permission.per }).filter(i=>i).length > 0}
                        disableRipple
                      />
                    </PermissionItem>
                  )
                })}
              </PermissionView>
            </>
          }

          <Title mt={user.access === 'admin'?15:0} mb={0}>Cursando</Title>
          <UserCursosTable data={user?.cursos ?? []}/>

        </TableCollapse>
      </Collapse>
    </Container>
  )
}
