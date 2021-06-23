import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import {NavLogo} from '../../Main/NavLogo'
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpen from '@material-ui/icons/MenuOpen';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import RichTooltip from '../Components/MultUsage/RichTooltip'
import {BootstrapTooltip} from '../../Main/MuiHelpers/Tooltip'
import { Link } from 'react-router-dom';
import {itemsProfile} from '../../../constants/itemsProfile'
import {useLoaderScreen} from '../../../context/LoaderContext'
import {useNotification} from '../../../context/NotificationContext'
import {useAuth} from '../../../context/AuthContext'
import {navList} from '../../../constants/itemsNav'

import FormControlLabel from '@material-ui/core/FormControlLabel';

import {LogOut} from '../../../services/firebaseAuth'
import {useStyles,DarkModeSwitch as DarkModeSwitchMui} from './styles'
import {onLogout} from './func'
import {Icons} from '../../Icons/iconsDashboard'

import {DASHBOARD,ADMIN_PERFIL} from '../../../routes/routesNames'
import {AbreviarNome,InitialsName} from '../../../helpers/StringHandle'
import usePersistedState from '../../../hooks/usePersistedState.js';
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import { useHistory } from "react-router-dom"
import {ThemeContext} from "styled-components";

export default function NavBar({open,setOpen}) {

  const [openProfile, setOpenProfile] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const anchorRef = React.useRef(null);
  const { setLoaderDash } = useLoaderDashboard();
  const history = useHistory()

  const {load,setLoad} = useLoaderScreen();
  //const {setLoadDash,loadDash}= useLoaderDash();
  const notification = useNotification();
  const {currentUser} = useAuth();
  const themes = React.useContext(ThemeContext)

  function ReactLink(props) {
    return(
      <>
      {props.to ?
        <Link {...props}>
          {props.children}
        </Link>
      :
        <div {...props}>
          {props.children}
        </div>
      }
      </>
    )
  }


  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function onProfileClick(action) {
    if (action === 'logout') onLogout({setLoad,notification})
    if (action === 'perfil') {
      history.push(ADMIN_PERFIL)
      setOpenProfile(false)
      setLoaderDash(true)
    }
  };

  const handleDarkModeChange = () => {
    setTheme(theme =='dark' ? 'light' : 'dark')
  };

  return (
      <AppBar
        elevation={2}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{backgroundColor:themes.palette.background.nav}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose:handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            {open ?
            <MenuOpen />
            :
            <MenuIcon />
            }
          </IconButton>
          <NavLogo to={DASHBOARD} small='true' />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {navList.map((item, index) => (
              <div key={index}>
              { item.visible === 'all' || (currentUser?.access && item.visible.includes(currentUser.access)) ?
                <ReactLink onClick={item?.onClick ?()=>notification.modal({title: 'Notifição',text:'Notifição padrão do sistema',open:true,onClick:()=>console.log('notification confirm')}):()=>notification.success({message:'Em construção'})} to={item.to} style={{margin:'0px 5px'}}>
                  <BootstrapTooltip placement="bottom" TransitionProps={{ timeout: {enter:500, exit: 50} }} title={item.text} styletooltip={{transform: 'translateY(10px)'}}>
                    <IconButton aria-label={item.text}>
                      <Badge badgeContent={0} color="secondary">
                        <Icons type={item.icon} className={classes.iconColor} />
                      </Badge>
                    </IconButton>
                  </BootstrapTooltip>
                </ReactLink>
              :null}
              </div>
            ))}
          </div>

          <RichTooltip anchorRef={anchorRef}  open={openProfile} setOpen={setOpenProfile} translateY={18}>
            {itemsProfile.map((item, index) => (
                <div onClick={()=>onProfileClick(item.onClick)} className={classes.boxItem} key={item.text} >
                    <Icons className={classes.icons} type={item.icon}/>
                    <p style={{color:themes.palette.text.secondary,fontSize:'15px',marginRight:20}} >{item.text}</p>
                </div>
            ))}
          </RichTooltip>

          <div onClick={()=>setOpenProfile(true)} className={classes.divName}>
            <p className={classes.profileName} style={{fontSize:17}}>
              {currentUser?.name ? AbreviarNome(currentUser.name,22) : 'Sem Identificação'}
            </p>
            <p className={classes.profileName} style={{fontSize:8}}>
              {currentUser?.company && currentUser.company?.name ? currentUser.company.name : 'Individual'}
            </p>
          </div>
          <div ref={anchorRef} onClick={()=>setOpenProfile(true)} className={classes.profileContainer}>
            <div className={classes.profile}>
                {!currentUser?.photoURL ?
              <div>
                <p className={classes.profileCircleName} style={{fontSize:17}}>
                  {currentUser?.name ? InitialsName(currentUser.name,22) : 'SI'}
                </p>
              </div>
            :
              <img style={{height:44,width:44,borderRadius:'50%'}} src={currentUser.photoURL} alt={'perfil_photo'} />
            }
                {/* <Icons className={classes.profileCircleName} type={'Person'}/> */}
            </div>
          </div>


        </Toolbar>
      </AppBar>
  );
}

