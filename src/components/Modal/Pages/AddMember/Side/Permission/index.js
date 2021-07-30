/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import { BootstrapTooltip } from '../../../../../Main/MuiHelpers/Tooltip';
import { PERMISSIONS } from '../../../../../../constants/geral';

const TitleSection = styled.h3`
  color:${({ theme }) => theme.palette.text.primary};
  font-size:16px;
  margin:20px 0 0px 0;
`;


const EpiView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.background.line};
  cursor: pointer;

  &:hover {
    opacity: 0.6;
    background-color: #55555509;
  }

  p {
    padding-right: 20px;
    width: 100%;
  }

  &.group {
    padding-top:20px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
    margin-bottom:1px;
    padding-bottom:5px;
    p {
      color:${({ theme }) => theme.palette.text.secondary};
      font-size:13px;
    }
  }

  &.last {
    margin-bottom:13px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
  }
`;

const Check = styled(Checkbox)`
  height: 35px;
  width: 35px;
`;


export function PermissionSelect({ fieldEdit, setPermissions, permissions, isNewClient }) {

  const permissionsArray = !isNewClient
  ? PERMISSIONS.filter(i=>!(i.per.includes('co') || i.per.includes('fm')))
  : PERMISSIONS.filter(i=>(i.per.includes('co') || i.per.includes('fm')))

  const handlePermissions = (event, permission) => {
    const newData = { ...permissions };
    newData[`${fieldEdit.index}--${permission.per}`] = event.target.checked;

    setPermissions(newData);

  };

  const isCompany =  permissions[(`${fieldEdit.index}--co`)]

  return (
    <>
      <TitleSection style={{marginBottom:12,marginTop:10}}>
        Permissões
      </TitleSection>
      {permissionsArray.map((permission,index) => {
        const checkPer = Boolean(permissions[`${fieldEdit.index}--${permission.per}`]);
        if (!isCompany && permission.per == 'fm') return null
        const isLast = (index===permissionsArray.length-1) || (!isCompany && `${fieldEdit.index+1}--fm` in permissions && index===permissionsArray.length-2)
        return (
          <BootstrapTooltip key={permission.id} title={permission.message}>
            <EpiView
              className={isLast ?'last':''}
              las={permission.id}
              onClick={() =>
                handlePermissions(
                  { target: { checked: !checkPer } },
                  permission
                )
              }
            >
              <p>{permission.name}</p>
              <Check
                size="small"
                checked={checkPer}
                color="primary"
              />
            </EpiView>
          </BootstrapTooltip>
        )
      })}
      {/* {isFM && (
        <>
          <TitleSection style={{marginBottom:12,marginTop:10}}>
            Faturamento Mensal
          </TitleSection>
          <EpiView
            className={'last'}
            onClick={() =>
              handlePermissions(
                { target: { checked: !checkFM } },
                permissionFM
              )
            }
          >
            <p>{permissionFM.name}</p>
            <Check
              size="small"
              checked={checkFM}
              color="primary"
            />
          </EpiView>
        </>
      )} */}
    </>
  );
}
