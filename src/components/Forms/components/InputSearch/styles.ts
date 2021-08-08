import { Close, KeyboardArrowDownRounded } from '@material-ui/icons';
import styled, { css } from 'styled-components';
import { fade, darken } from '@material-ui/core/styles';
import { IForm, ISearch } from './@interfaces';

export const FormControl = styled.div<IForm>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
`;

export const InputRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  align-items: center;
  display: flex;
  padding: 0 0.5rem 0 0;
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

export const SearchView = styled.div<ISearch>`
  box-shadow: 2px 2px 8px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => darken(theme.palette.background.line, 0.4)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 7px;
  width: 100%;
  position: absolute;
  top: 45px;
  height: fit-content;
  max-height: 300px;
  z-index: 20000;
  overflow: auto;

  ${(props) =>
    props.empty &&
    css`
      border: 2px solid ${({ theme }) => theme.palette.background.line};
      background-color: ${({ theme }) =>
        darken(theme.palette.background.paper, 0.02)};
      height: fit-content;
      justify-content: center;
      padding: 0.75rem 10px;
      text-align: center;
      color: ${({ theme }) => theme.palette.text.secondary};
    `}
`;

export const ArrowIcon = styled(KeyboardArrowDownRounded)`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-left: 0.25rem;
  opacity: 0.6;
  cursor: pointer;
  &.MuiSvgIcon-fontSizeInherit {
    font-size: 1.5rem;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const Line = styled.div`
  height: 60%;
  width: 1px;
  background-color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
`;

export const CloseIcon = styled(Close)`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-right: 0.4rem;
  cursor: pointer;
  opacity: 0.6;
  &.MuiSvgIcon-fontSizeInherit {
    font-size: 1.1rem;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;
