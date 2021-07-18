import styled from "styled-components";
import IconButton from '@material-ui/core/IconButton';

export const Container = styled.div`
  padding:50px 54px;

  @media screen and (max-width: 1100px) {
    padding:26px 40px;
  }

  @media screen and (max-width: 700px) {
    padding:30px 20px;
  }
`;


export const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 1rem;

  &.bottom {
    margin-bottom: 10px;
  }
`;


export const IconButtonStyled = styled(IconButton)`
  margin-left: 8;
`;


export const AddCard = styled.div`
  padding: 10px 20px 10px 20px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 40px;
  /* border: 1px solid #aaa; */
  border-radius: 7px;
  width:300px;
  height: fit-content;
  border-left: 5px solid ${({theme})=> theme.palette.status.successD};
  -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.23);
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.23);
  cursor:pointer;

  &:hover {
    opacity:0.8;
  }

  &:active {
    opacity:1;
  }

  &:hover ${IconButtonStyled} {
    background-color: rgba(0,0,0,0.05);
  }

`;

