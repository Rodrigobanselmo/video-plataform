import styled, {css} from "styled-components";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { lighten,darken,fade } from "@material-ui/core/styles";

export const FormLabel = styled(FormControlLabel)`
  color: ${({theme})=>theme.palette.text.primary};
  align-self: flex-start;
  margin-bottom: 20px;
  margin-left: 20px;
`;


export const PoliticsContainer = styled.div`
  height: 50vh;
  width: 100%;
  color: ${({theme})=>theme.palette.text.primary};
  background-color: ${({theme})=>theme.palette.background.paper};
  overflow: hidden scroll;
  margin-bottom: 5px;
  border: 1px ${({theme})=>theme.palette.background.line} solid;
  padding: 20px;
  border-radius:10px;
  font-size:14px;
  line-height:1.6;
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  margin-right: 20px;
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  div {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    background: ${({theme})=>fade(theme.palette.primary.mainLight,0.4)};
    border: 2px solid ${({theme})=>(theme.palette.text.third)};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: ${({theme})=>(theme.palette.primary.main)};
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      color: ${({theme})=>(theme.palette.primary.contrastText)};
    }
    &:hover {
      background: ${({theme})=>fade(theme.palette.primary.main,0.8)};
    }
  }
`;
