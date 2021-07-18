import styled, { css } from 'styled-components';

interface Props {
  small: boolean;
  horizontal: boolean;
}

export const CardView = styled.div<Props>`
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 250px;
  min-width: 250px;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 20px;
  border-radius: 10px;
  border: none;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.13);

  img {
    justify-self: flex-end;
    width: 45px;
    margin-bottom: 10px;
    margin-left: 10px;
    height: 45px;
    padding: 0px 0px;
  }
  p.title {
    margin-bottom: 5px;
    font-size: 16px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  p.text {
    font-size: 14px;
    line-height: 1.4;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  ${(props) =>
    props.horizontal &&
    css`
      @media screen and (max-width: 1200px) {
        margin-right: 10px;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 15px 10px;
        margin-bottom: 0px;
        width: 100%;
        /* background-color: transparent; */
        /* box-shadow: none; */

        p {
          margin-bottom: 0px;
        }

        > div {
          width: 200px;
        }
      }
    `}

  @media screen and (max-width: 900px) {
    /* background-color: transparent; */
    /* box-shadow: none; */
    width: 100%;
    height: fit-content;
    min-width: 100%;
    flex-direction: row;
    padding: 15px 10px;
    margin-bottom: 10px;

    p {
      margin-bottom: 10px;
    }
    /* justify-content: flex-start; */
    > div {
      width: 200px;
    }
  }
`;
