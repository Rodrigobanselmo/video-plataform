import styled from 'styled-components';

export const Title = styled.h2`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.5rem;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;
