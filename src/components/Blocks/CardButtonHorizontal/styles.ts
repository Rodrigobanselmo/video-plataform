import styled, { css } from 'styled-components';

interface Props {
  small: boolean;
}

export const CardView = styled.button<Props>`
  display: grid;
  grid-template-areas:
    'i t'
    'i p';

  gap: 5px 20px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  background-image: linear-gradient(
    -10deg,
    ${({ theme }) => theme.palette.primary.main},
    ${({ theme }) => theme.palette.primary.light}
  );

  align-items: center;
  justify-items: center;
  text-align: center;
  padding: 30px 40px;
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
    grid-area: i;
  }

  svg {
    grid-area: i;
    width: 60px;
    height: 60px;
    color: white;
  }

  p.title {
    grid-area: t;
    font-size: 15px;
    font-weight: bold;
    color: white;
  }

  p.text {
    grid-area: p;
    font-size: 15px;
    color: white;
    filter: brightness(0.85);
  }

  &:hover {
    filter: brightness(0.92);
  }

  @media screen and (max-width: 700px) {
    height: fit-content;
    grid-template-areas:
      'i'
      't'
      'p';
  }
`;
