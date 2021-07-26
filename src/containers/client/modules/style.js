import styled from "styled-components";

export const Container = styled.div`
  padding-right:50px;

  @media screen and (max-width:1100px) {
    padding-right:35px;
  }

  @media screen and (max-width: 700px) {
    padding-right:15px;
  }
`;

export const SideVideoBarTry = styled.div`
  min-width: 350px;
  box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.19);
  display: flex;
  flex-direction: column;
  flex: 0;
  background-color: ${({theme})=>theme.palette.background.default};
  border-radius: 5px;
  position:relative;

  @media screen and (max-width:1100px) {
    background-color: ${({theme})=>theme.palette.background.paper};
    height:fit-content;
    overflow-y:visible;
    > div {
      box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);
      position:relative;
      height:fit-content;
    }
  }

  @media screen and (max-width:700px) {
    min-width: 150px;
  }

`;

export const PercentageSpan = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
  color: ${({theme})=>theme.palette.text.third};
`;

export const Shadow = styled.div`
  max-width: 1400px;
  border-radius: 10px;
  display: flex;
  margin: auto;
  flex-direction: column;
  padding: 30px 50px;
  width: 100%;
  background-color: ${({theme})=>theme.palette.background.paper};
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);

  @media screen and (max-width:1100px) {
    padding: 0px 0px;
    background-color: transparent;
    box-shadow: none;
  }


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

export const ProgressWrapper = styled.div`
  width: 170px;
  height: 100%;
  border-radius: 30px;
  background-color: ${({theme})=>theme.palette.background.default};
  @media screen and (max-width:1100px) {
    background-color: ${({theme})=>theme.palette.background.paper};
  }
`;

export const ProgressBar = styled.div`
  border-radius: 30px;
  height: 7px;
  background-color: ${({theme})=>theme.palette.primary.main};
`;


export const ContainerPlayer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap:30px;

  @media screen and (max-width:1100px) {
    flex-direction: column;
  }
`;


export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;


export const Title = styled.span`
  font-size: 24px;
  color:${({theme})=>theme.palette.text.primary};
  font-weight: bold;
  margin-bottom: 3px;
`;
