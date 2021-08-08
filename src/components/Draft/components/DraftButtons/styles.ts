import styled, { css } from 'styled-components';

export const ButtonView = styled.div`
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 30px;
  gap: 10px;
`;

interface IButon {
  appearance?: 'outlined' | 'normal';
}

export const Button = styled.button<IButon>`
  padding: 10px 0px;
  width: 100px;
  background-image: linear-gradient(
    -10deg,
    ${({ theme }) => theme.palette.primary.main},
    ${({ theme }) => theme.palette.primary.light}
  );
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 5px;

  &:disabled {
    background-color: ${({ theme }) => theme.palette.background.inactive};
  }

  ${(props) =>
    props.appearance === 'outlined' &&
    css`
      border: 2px solid ${({ theme }) => theme.palette.background.line};
      background: transparent;
      color: ${({ theme }) => theme.palette.text.secondary};
    `}
`;
