import styled, {css} from "styled-components";
import LockIcon from '@material-ui/icons/Lock';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


export const AulasContainer = styled.div`
  padding: 30px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;

`;


export const Circle = styled.div`
  width: 10px;
  height: 10px;
  margin-right: 30px;
  display: flex;
  flex-shrink: 0;
  position: relative;

`;

export const FillCircle = styled.div`
  background-color:  ${({theme})=>theme.palette.primary.greyDarkRealiza};
  border-radius: 10px;
  width: 10px;
  height: 10px;
  display: flex;
  z-index:2;

  ${props => props.active && css`
    background-color:  ${({theme})=>theme.palette.status.success};
  `}
`;

export const ShadowCircle = styled.div`
  background-color: #00000033;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: calc(50% - 10px);
  top: calc(50% - 10px);
  opacity:0;
  transition: opacity 0.2s ease;
  z-index:3;

  &:hover {
    opacity:1;
  }

  ${props => props.selected && css`
    opacity:1;
    border: 2px solid ${({theme})=>theme.palette.status.success};
    background-color: ${({theme})=>theme.palette.background.default};
    z-index:1;
  `}
`;

export const AulaWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover ${ShadowCircle} {
    opacity:1;
  }

`;

export const Line = styled.div`
  background-color: ${({theme})=>theme.palette.primary.greyDarkRealiza};
  width: 2px;
  height: 100px;
  top: 5px;
  right: calc(50% - 1px);
  position: absolute;
  z-index:0;

  ${props => props.active && css`
    background-color:  ${({theme})=>theme.palette.status.success};
  `}
  ${props => props.last && css`
    background-color:  ${({theme})=>theme.palette.background.default};
  `}
`;

export const Text = styled.span`
  font-size: 14px;
  margin-right:auto;

  user-select:none;
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -webkit-touch-callout:none;

  ${props => props.active && css`
    color:  ${({theme})=>theme.palette.status.successD};
  `}
`;

export const IconLock = styled(LockIcon)`
  margin-left:20px;
  color: ${({theme})=>theme.palette.primary.greyDarkRealiza};
`;

export const IconArrow = styled(KeyboardArrowDownIcon)`
  margin-left:20px;
  color: ${({theme})=>theme.palette.primary.greyDarkRealiza};
  transition: transform 0.2s ease;

  ${props => props.isOpenModule && css`
    transform: rotate(180deg);
  `}
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



export const SideContainer = styled.div`
  position:absolute;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  flex: 0;
  overflow-y: auto;
  height:100%;
  border-radius: 5px;
`;

export const ModuleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 16px;
  /* background-color: #d2d5d5; */
  margin: 2px 0;
  align-items: center;
  background-image: linear-gradient(to bottom right, #d2d5d5, #bdbec3);
  cursor: pointer;

  &:hover {
    background-image: linear-gradient(to bottom right, #bdbec3, #bdbec3);
  }

  ${props => props.first && css`
    border-radius: 5px 5px 0 0;
    margin-top:0;
  `}
`;

export const NumberCircle = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: rgb(225, 225, 230);

  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -webkit-touch-callout:none;
`;

export const TextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-right: auto;
  flex-direction: column;
`;

export const TitleModule = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme})=>theme.palette.text.primary};

  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -webkit-touch-callout:none;
`;

export const NumberOfClassesText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: ${({theme})=>theme.palette.text.secondary};

  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -webkit-touch-callout:none;
`;
