import styled, {css} from "styled-components";

export const ContainerDiv = styled.div`
  width: 100%;
  background-color: ${({theme})=> theme.palette.background.paper};
  border-radius: 15px;
  -webkit-box-shadow: 3px 4px 16px 1px rgba(0,0,0,0.33);
  box-shadow:  3px 4px  16px 1px rgba(0,0,0,0.3);
`;


export const AddButtonActivitie = styled.div`
  margin:5px auto 20px 26px;
  padding:0px 10px 2px;
  display:inline-block;
  border-radius:10px;
  border: 1px solid ${({theme})=> theme.palette.background.line};
  background-color: ${({theme})=> theme.palette.primary.mainBlue};
  cursor: pointer;
  span {
    margin:0;
    padding:0;
    font-size:12px;
    color: ${({theme})=>theme.palette.primary.contrastText};
  }

  &:hover {
    opacity:0.7;
    /* filter: brightness(0.95); */
  }

  &:active {
    opacity:0.8;
    /* filter: brightness(0.95); */
  }

  ${props => props.prof && css`
    margin:0px ;
  `}
`;
