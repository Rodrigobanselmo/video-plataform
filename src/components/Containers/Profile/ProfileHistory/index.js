import React from 'react';
import { formatCPFeCNPJeCEPeCNAE } from '../../../../helpers/StringHandle';
import styled from "styled-components";
import { useUserHistory } from '../../../../services/hooks/get/useUserHistory';
import { HistoryTable } from '../../../Main/Tables/History';
import { lighten } from '@material-ui/core/styles';



const Container = styled.div`
  border-radius: 5px;
  background-color: ${({theme})=>lighten(theme.palette.background.default,0.3)};
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.23);
  padding:1rem 1rem;
  border-radius: 10px;
  max-height:100%;
  position: relative;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size:1.6rem;
  margin-bottom:0.5rem;
`;


export function ProfileHistory({user}) {

  const { data, isLoading } = useUserHistory(user)


  return (
    <Container>
      <Title>Histórico</Title>
      {data && <HistoryTable
        data={data}
        isLoading={isLoading}
      />}
    </Container>
  );
}
