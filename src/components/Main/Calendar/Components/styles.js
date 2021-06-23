import {Icons} from '../../../components/Icons/iconsDashboard'
import styled, {css} from "styled-components";

export const CardDiv = styled.div`
  display: flex;
  flex-direction:column;
  padding:10px;
  border: 1px solid ${({theme})=> theme.palette.background.line };
  border-left: 4px solid ${({theme})=> theme.palette.primary.mainOrange };
  margin:0px 4px;
  border-radius:5px;
  margin-top: 5px;
  position:relative;
  cursor: pointer;

  &:hover {
      background-color: ${({theme})=> darken(theme.palette.background.paper,0.05) };
      opacity:0.7;
  }

  & + div {
    margin-top: 10px;
  }

  ${props => props.online && css`
    border-left: 4px solid ${({theme})=> theme.palette.primary.mainGreen };
  `}

  ${props => props.fill && css`
    background-color: ${({theme})=> fade(theme.palette.status.success,0.15) };
  `}

  ${props => props.toConfirm && css`
    background-color: ${({theme})=> fade(theme.palette.status.warn,0.15) };
  `}

  ${props => props.cancel && css`
    background-color: ${({theme})=> fade(theme.palette.status.fail,0.15) };
  `}

  ${props => props.prev && css`
    opacity:0.5;
  `}

`;

export const ContainerWeekdays = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding:5px;
  border-radius:2px;
  border-top-left-radius:10px;
  border-top-right-radius:10px;
  background-color: ${({theme})=> theme.palette.primary.contrastText };
  border-bottom: 1px solid ${({theme})=> theme.palette.background.line };

  & span {
    font-size:10px;
    padding-left:2px;
  }

  ${props => props.today && css`
    background-color: ${({theme})=> theme.palette.primary.main };
    color: ${({theme})=> theme.palette.primary.contrastText };
  `}
`;

export const ContainerWeek = styled.div`
  display: flex;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.12);
  flex:1;
  flex-direction: column;
  background-color: ${({theme})=> theme.palette.primary.contrastText };
  border-radius:10px;
  margin-right: ${({last})=> last?0:'10px'};
  min-height:500px;
  border: 1px solid ${({theme})=> theme.palette.background.line };


  @media screen and (max-width: 1000px) {
    margin-right: 0;
  }
`;

export const Header = styled.div`
  padding: 0px 5px;
  margin-bottom:20px;
  flex-direction:row;
  justify-content:space-between;
  display: flex;
  font-size:22px;
  color: ${({theme})=> theme.palette.text.secondary };
`;

export const Week = styled.div`
  display:flex;
  flex:1;
  justify-content: space-between;
  flex-direction:row;
  margin:0 3px;

  @media screen and (max-width: 1000px) {
    flex-direction:column;
  }
`;

export const CalendarContainer = styled.div`
  background-color: ${({theme})=>theme.palette.background.paper};
  padding: 20px 15px;
  border-radius:10px;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.22);
  display:flex;
  flex:1;
  flex-direction:column;
`;

export const Button = styled.div`
  border-radius: 50px;
  background: ${({theme})=>theme.palette.primary.main};
  white-space: nowrap;
  padding: 6px 18px;
  color: ${({theme})=>theme.palette.primary.contrastText};
  font-weight:bold;
  font-size: 14px;
  outline: none;
  border: none;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.12);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(0.95);
  }
`;
