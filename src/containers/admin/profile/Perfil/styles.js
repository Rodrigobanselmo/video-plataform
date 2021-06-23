import styled from "styled-components";

export const ContainerDiv = styled.div`
  width: 100%;
  padding:0px 20px 1px 20px;
  background-color: ${({theme})=> theme.palette.background.paper};
  border-radius: 15px;
  -webkit-box-shadow: 3px 4px 16px 1px rgba(0,0,0,0.33);
  box-shadow:  3px 4px  16px 1px rgba(0,0,0,0.3);
`;
