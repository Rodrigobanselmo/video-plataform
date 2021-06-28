import styled from "styled-components";



export const Container = styled.div`
  max-width: 1400px;
  border-radius: 10px;
  display: flex;
  margin: auto;
  flex-direction: column;
  padding: 30px 50px;
  width: 100%;
  /* background-color: ${({theme})=>theme.palette.background.paper}; */
  /* box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19); */
`;

export const CircleView = styled.div`
  border-radius: 40px;
  box-sizing: content-box;
  display: flex;
  flex-shrink: 0;
  color: ${({theme})=>theme.palette.status.success};
  background-image: linear-gradient(to bottom right, ${({theme})=>theme.palette.primary.main}, ${({theme})=>theme.palette.primary.dark});
  width: 40px;
  height: 40px;
  margin-right: 25px;
  align-items: center;
  position: relative;
  justify-content: center;
`;
