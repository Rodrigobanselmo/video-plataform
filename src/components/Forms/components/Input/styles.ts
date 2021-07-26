import { fade } from '@material-ui/core/styles';
import styled from 'styled-components';
import { IForm } from './@interfaces';

export const FormControl = styled.div<IForm>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const InputRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  align-items: center;
  display: flex;
  padding: 0 1rem 0 0;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex: 1;
`;

export const InputElement = styled.input`
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => fade(theme.palette.text.primary, 0.8)};
  padding: 0.5rem 1rem;
  margin-top: 0.1rem;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.palette.background.line};
  transition: all 0.3s ease;
  margin-right: 2px;
  width: 100%;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.primary.main};
    transition: all 0.3s ease;
  }
`;

export const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
`;

export const FormErrorMessage = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => fade(theme.palette.status.fail, 0.8)};
`;
