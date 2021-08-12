import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styled, {css} from "styled-components";
import IconButton from '@material-ui/core/IconButton';
import { Icons } from '../../Icons/iconsDashboard';

const IconCloseButton = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 25px;
  padding:7px;
  border-radius:4px;
  max-width:100px;

  ${props => props.padding && css`
      top: 10px;
  `}

`;

const Icon = styled(Icons)`
  font-size: 30px;
  border-radius:4px;
  color: ${props=>props.transparent?'#eee':props.theme.palette.text.primary};
  cursor: pointer;

  &:hover {
    /* color:${({theme})=>theme.palette.text.secondary}; */
  color: ${props=>props.transparent?'#fff':props.theme.palette.text.secondary};
  }

  &:active {
    /* color:${({theme})=>theme.palette.text.third}; */
  color: ${props=>props.transparent?'#eff':props.theme.palette.text.third};
  }
`;

const IconLeft = styled(Icons)`
  color: ${props=>props.theme.palette.text.primary};
  font-size: 22px;
  margin-right:10px;

  ${props => props.icon == 'success' && css`
    color: ${props=>props.theme.palette.status.success};
  `}
`;

const TitleView = styled.p`
  position: absolute;
  top: 15px;
  left: 20px;
  display:flex;
  align-items: center;
  flex-direction:row;

  ${props => props.padding && css`
      left:0;
      position: relative;
      margin: 0 0 30px 0;
      align-self:left;
      margin-right:auto;
  `}

`;

const Title = styled.p`
  color: ${props=>props.theme.palette.text.primary};
  font-size: 22px;
  font-weight: bold;

  ${props => props.padding && css`
      text-align:left;
      align-self:left;
      margin-right:auto;
  `}

`;

export function ModalNormal({children,open,onClose,title,padding,icon}) { // TODO:ainda tem que faze



const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position:'relative',
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    /* border: '2px solid #000', */
    boxShadow: theme.shadows[10],
    padding:'60px 23px 20px 20px',
    marginLeft:30,
    marginRight:30,
    borderRadius:10,
  },
  fullScreen: {
    position:'relative',
    zIndex:1111110,
    backgroundColor: theme.palette.background.paperModal,
    width:'100%',
    height:'100%',
    overflowY:'scroll'
  },
}));

  const classes = useStyles();

  function onCloseModal() {
    onClose()
  }

  return (
      <Modal
        style={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}
        open={open}
        onClose={onCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
{/*         <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={600}> */}
          <div style={{padding:padding=='large'?'10px 40px 40px 40px':'60px 23px 20px 20px',maxHeight:'90vh'}} className={classes.paper}>
            {title ?
            <TitleView>
              {icon &&<IconLeft icon={icon} type={'Check'} />}
              <Title padding={padding}>{title}</Title>
            </TitleView>
            : null}
              <IconCloseButton padding={padding}>
                <IconButton onClick={onCloseModal} aria-label="close">
                    <Icon type={'Close'} />
                </IconButton>
            </IconCloseButton>
            {children}
          </div>
{/*         </Slide> */}
        </Fade>
      </Modal>
  );
}
