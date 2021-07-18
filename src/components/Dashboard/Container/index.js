import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../Sidebar'
import NavSystem from '../NavSystem'
// import {LoaderDashboard} from '../../../components/Main/Loader/index'
import {useAuth} from '../../../context/AuthContext'
import useTimeOut from '../../../hooks/useTimeOut'
import styled from "styled-components";

const Content = styled.main`
    position:relative;
    flex-grow: 1;
    height:auto;
    overflow-y: scroll;
    background-color:${({ theme }) => theme.palette.background.default};
    height:100vh;
    padding:50px 0px 50px 54px;

    @media screen and (max-width: 1100px) {
    padding:26px 0px 26px 40px;
  }

  @media screen and (max-width: 700px) {
    padding:30px 0px 30px 20px;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    backgroundColor:theme.palette.background.default,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    transition: theme.transitions.create('background-color', {
      duration: 660,
    }),
  },
  content: {
    // position:'relative',
    // flexGrow: 1,
    // padding: theme.spacing(6,7),
    // height:'auto',
    // overflowY: 'scroll',
    // backgroundColor:theme.palette.background.default,
    // height:'100vh',
    // transition: theme.transitions.create('background-color', {
    //   duration: 660,
    // }),
  },
}));

export default function MiniDrawer({children}) {

  const [open, setOpen] = React.useState(false);
  const [lock, setLock] = React.useState(false);

  const classes = useStyles();
  const {currentUser} = useAuth();
  const [onTimeOut,onClearTimeOut] = useTimeOut(); //para auxiliar openNavDrawer function


  function openNavDrawer(state) { //essa funcao serve para poder controlar a abartura e fechamendo do drawer podendo manejas se ele foi aberto pelo navBar ou pelo mouseEnter
    setOpen(state)
    setLock(state)
    onClearTimeOut()
  }

  return (
      // <LoaderDashboard open={open}>
      <div className={`classes ${classes.root}`}>
        {currentUser && currentUser?.access && currentUser.access === 'admin' ?
          <>
            <CssBaseline />
            <NavSystem  open={open} setOpen={openNavDrawer}/>
            {/* <Sidebar open={open} setOpen={setOpen} lock={lock} onTimeOut={onTimeOut} onClearTimeOut={onClearTimeOut} setLock={setLock}/> */}
          </>
        : null }
        <Content id = "someRandomID" className={classes.content}>
            <div className={classes.toolbar} />
              {children}
        </Content>
    </div>
    // </LoaderDashboard>
  );
}
