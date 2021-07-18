import styled, { css } from 'styled-components';

interface Props {
  small: boolean;
}

export const CardView = styled.button<Props>`
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 240px;
  min-width: 240px;
  height: 210px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  margin-right: 10px;
  border-radius: 10px;
  border: none;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.13);
  cursor: pointer;

  img {
    width: 60px;
    margin-bottom: 5px;
    height: 60px;
    padding: 0px 0px;
  }
  p.title {
    margin-bottom: 5px;
    font-size: 15px;
  }

  p.text {
    font-size: 15px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &:hover {
    opacity: 0.8;
  }

  ${(props) =>
    props.small &&
    css`
      width: 250px;
      min-width: 250px;
      height: fit-content;
      padding: 30px 10px;
    `}
`;
