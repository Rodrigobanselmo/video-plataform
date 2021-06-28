import styled, {css} from "styled-components";
import CropLandscape from "@material-ui/icons/CropLandscape";
import SkipNext from "@material-ui/icons/SkipNext";
import SkipPrevious from "@material-ui/icons/SkipPrevious";


export const BottomBar = styled.div`
  width: 100%;
  align-items: center;
  background-color: #202024;
  flex-direction: row;
  display: flex;
  padding: 18px 16px;
  border-radius: 0px 0px 5px 5px;
`;

export const BoxIcon = styled.div`
  height: 40px;
  width: 110px;
  background-color: ${({theme})=>theme.palette.primary.main};
  border-radius: 5px;
  padding:0 10px;
  margin-right: 16px;
  display:flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;

&:hover {
  filter: brightness(0.85);
}
&:active {
  filter: brightness(0.95);
}

`;

export const FullIcon = styled(CropLandscape)`
  color: #ffffff;
`;

export const PreviousIcon = styled(SkipPrevious)`
  color: #ffffff;
`;

export const NextIcon = styled(SkipNext)`
  color: #ffffff;
`;

export const SliderButton = styled.div`
  position: relative;
  width:72px;
  height:24px;
  padding:4px;
  background-color: rgb(2, 2, 8);
  border-radius: 100px;
  transition: background-color 0.2s ease 0s;
  cursor: pointer;
  opacity: 1;

  ${props => props.autoplay && css`
    background-color: ${({theme})=>theme.palette.primary.main};
  `}

`;

export const SliderInside = styled.div`
  width:35px;
  height:16px;
  background-color: ${({theme})=>theme.palette.primary.main};
  border-radius: 30px;
  transition: transform 0.2s ease 0s;
  transform:translateX(0px);

  ${props => props.autoplay && css`
    background-color: #fff;
    transform:translateX(29px);
  `}

`;

export const TextSlider = styled.span`
  color: #eee;
  margin-left: 16px;
`;
