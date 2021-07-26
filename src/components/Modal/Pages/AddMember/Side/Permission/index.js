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
    border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
  }
`;

const Check = styled(Checkbox)`
  height: 35px;
  width: 35px;
`;


export function PermissionSelect({ email, setPermissions, permissions, isAdmin }) {

  const handlePermissions = (event, permission) => {
    const newData = { ...permissions };
    newData[`${email.index}--${permission.per}`] = event.target.checked;

    setPermissions(newData);

  };

  return (
    <>
      {isAdmin && (
        <TitleSection style={{marginBottom:12,marginTop:10}}>Permissões</TitleSection>
      )}
      {isAdmin && PERMISSIONS.map((permission,index) => {
        const checkPer = Boolean(permissions[`${email.index}--${permission.per}`]);
        return (
          <BootstrapTooltip key={permission.id} title={permission.message}>
            <EpiView
              className={index===PERMISSIONS.length-1?'last':''}
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
    </>
  );
}
