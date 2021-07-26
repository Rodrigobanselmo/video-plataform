import styled, {css} from "styled-components";
import { BiExpand,BiCollapse } from 'react-icons/bi';
import { FaCog } from 'react-icons/fa';

export const SoundFill = styled.div`
display: flex;
z-index: 10;
min-width: 6px;
height: ${({item})=>2+12*item}px;
transform: translateX(-3px);
background-image: linear-gradient(to right,${({theme})=>theme.palette.primary.light} 50%,#6f7070 50%);

&:hover {
  height: ${({item})=>item*12+4}px;
}
`;

export const SoundView = styled.div`
display: flex;
align-items: flex-end;
height:16px;
margin:0 10px 2px 15px;
position:relative;
cursor:pointer;

`;

export const SoundColumn = styled.div`
width: 3px;
overflow: hidden;
height:  16px;
margin-right: 2px;
transition: height 0.2;
position:relative;
display: flex;
align-items: flex-end;

&:last-child {
  margin-right: 0px;
}

`;

export const IconCog = styled(FaCog)`
transform:rotate(${({rotatecog})=>rotatecog==='true'?30:0}deg);
margin:0 7px 0 10px;
flex-shrink:0;

  @media screen and (max-width:700px) {
    font-size: 10px;
    padding:2px;
    margin:0 3px 0 6px;
  }

`;

export const PlayView = styled.div`
display: flex;
padding:0px 10px;
background-color: #000000cc;
color:#fff;
border-radius:6px;
margin-right:10px;
transition: background-color 0.2s ease;

svg {
  font-size: 38px;
}

&:hover {
  background-color: ${({theme})=>theme.palette.primary.main};
}
`;

export const BottomCrontols = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
  padding: 1rem;
  max-width: 1100px;
  margin: 0px auto;
`;

export const ProgressView = styled.div`
width: 100%;
display: flex;
padding:5px 10px;
background-color: #000000cc;
border-radius:3px;
color:#fff;
align-items: center;
// if (screenful.isFullscreen())

svg {
  font-size:24px;
  &:hover {
    color: ${({theme})=>theme.palette.primary.light};
  }

}
`;

export const TooltipSpan = styled.span`
position: absolute;
text-align: center;
content: "00:00";
font-size: 10px;
top: -18px;
left: -19px;
height: fit-content;
width: 36px;
background-color: #fff;
font-weight:400;
color: #000000;
border-radius:1px;
letter-spacing:0.5px;
-webkit-box-shadow: 1px 1px 0px 0px #000000;
box-shadow: 1px 1px 0px 0px #000000;

&:after {
width: 0;
position: absolute;
content: "";
bottom: -3px;
left: 13.5px;
height: 0;
border-left: 4px solid transparent;
border-right: 4px solid transparent;
border-top: 4px solid #fff;
}

`;

export const TooltipMouseSpan = styled.span`
position: absolute;
font-family: "Helvetica Neue",Helvetica,Arial;
text-align: center;
content: "00:00";
font-size: 10px;
top: -18px;
left: -19px;
height: fit-content;
width: 34px;
opacity:0;
background-color: #000000;
font-weight:400;
color: #fff;
border-radius:1px;
letter-spacing:0.5px;
transition: opacity 0.3s linear;
-webkit-transition: opacity 0.3s linear;
`;

export const ProgressInput = styled.input`
overflow: hidden;
width: 100%;
-webkit-appearance: none;
background-color: transparent;
appearance: none;
outline: none;
margin:0;
padding:0;
border:none;
position: absolute;
top:1px;
left:1px;

cursor: pointer;
&:active {
  cursor: grabbing;
}

&::-webkit-slider-runnable-track {
  height:10px;
  -webkit-appearance: none;
  color: ${({theme})=>theme.palette.primary.main};
  margin-top: -1px;
}

&::-webkit-slider-thumb {
  width: 1px;
  -webkit-appearance: none;
  height: 10px;
  background: ${({theme})=>theme.palette.primary.main};
  box-shadow: -800px 0 0 800px ${({theme})=>theme.palette.primary.main};
}

/* Moz */

&::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: ${({theme})=>theme.palette.primary.main};
  cursor: pointer;
  border-radius:50%;
  border:none;
  outline:none;
}
&::-moz-range-progress {
  background-color: #fff;
  color: ${({theme})=>theme.palette.primary.main};
    height: 100%;
  border-radius:30px;
  border:none;
}
&::-moz-range-track {
  background-color: transparent;
  color: ${({theme})=>theme.palette.primary.main};
  border-radius:30px;
  border:none;
    height: 100%;
}

/* IE*/
&::-ms-fill-lower {

background: ${({theme})=>theme.palette.primary.main};
height: 100%;
border-radius:30px;
border:none;
}
&::-ms-fill-upper {
background-color: transparent;
border-radius:30px;
border:none;
height: 100%;
}



/* -webkit-transition: .2s;  */
/* transition: opacity .2s; */
`;

export const ProgressContainer = styled.div`
height: fit-content;
width: 100%;
border: 1px solid #6f7070;
position: relative;
padding:1px;
margin:0px;
border-radius:1px;
`;

export const ProgressBar = styled.div`
width: 0%;
background-color: #6f7070;
height:9px;
transition:width 0.250s linear;

`;

export const MarkLast = styled.div`
position: absolute;
width: 2px;
height:9px;
top: 1px;
left: -1px;
background-color: #ffff00;
z-index:100;
opacity:1;

${props => props.hideMark && css`
  opacity:0;
`}
`;

export const ControlsWrapper = styled.div`
  position: absolute;
  background-color: #00000022;
  opacity:1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: opacity 0.6s ease;
`;
