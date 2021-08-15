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

import {DASHBOARD,ADMIN_PERFIL, PROFILE, STATEMENT} from '../../../routes/routesNames'
import {AbreviarNome,InitialsName} from '../../../helpers/StringHandle'
import usePersistedState from '../../../hooks/usePersistedState.js';
import {useLoaderDashboard} from '../../../context/LoadDashContext'
import { useHistory,useLocation } from "react-router-dom"
import {ThemeContext} from "styled-components";
import { menuList } from '../../../constants/menuList';
import styled, {css} from "styled-components";
import { AvatarView } from '../../Main/Avatar';

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({theme})=> theme.palette.primary.main };
  height: 3px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;


const NaveLink = styled(Link)`
  margin: 0px 20px;
  position: relative;
  min-width: 40px;
  display: flex;
  height: 60px;
  font-size: 16px;
  text-decoration: none;
  color: ${({theme})=> theme.palette.text.primary };
  justify-content: center;
  align-items: center;
  opacity:0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity:1;
    p {
      transform: scale(1.06);
    }
  }

  p {
    transition: transform 0.3s ease;
  }

  ${props => props.active === 'true' && css`
    font-weight: bold;
    opacity:0.85;
    p {
      transform: scale(1.06) translateX(1px);
    }
    &:hover {
    opacity:1;
      p {
        transform: scale(1.06) translateX(1px);
      }
    }

  `}

`;

const NavBar = ({open,setOpen}) => {

  const [openProfile, setOpenProfile] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const anchorRef = React.useRef(null);
  const { setLoaderDash } = useLoaderDashboard();
  const history = useHistory()
  const { pathname } = useLocation();

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

  function onProfileClick(action) {
    if (action === 'logout') onLogout({setLoad,notification})
    if (action === 'perfil') {
      if (pathname.includes(PROFILE)) return
      history.push(PROFILE)
      setOpenProfile(false)
      setLoaderDash(true)
    }
    if (action === 'statement') {
      if (pathname.includes(STATEMENT)) return
      history.push(STATEMENT)
      setOpenProfile(false)
      setLoaderDash(true)
    }
  };

  return (
      <AppBar
        elevation={2}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        {/* <div style={{backgroundColor:themes.palette.background.nav}}> */}
        <div style={{backgroundColor:themes.palette.background.nav,display:'flex',flexDirection:'row',alignItems:'center',height:'60px',padding:'2px 25px'}}>
          <NavLogo to={DASHBOARD} small='true' />


          <div style={{display:'flex',flex:1,marginLeft:60,justifyContent:'flex-start',flexDirection:'row'}}>
          {menuList.map((item, index) => {

            function pathActive() {
              if (item?.contain) {
                const array = item.contain.map((route) => {
                  return pathname.includes(route)
                })
                if (array.findIndex(i=>i === false) !== -1) return false
                return true
              }
              return pathname==item.route
            }
            const isActive = pathActive()

            const isPermissionGranted = !item?.permissions ? true :
              currentUser?.permission &&
              currentUser.permission.some(i=>item.permissions.includes(i))

            const isAccessGranted =
              item.visible === 'all' || (
                currentUser?.access &&
                item.visible.includes(currentUser.access)
              )


            if (isPermissionGranted && isAccessGranted) return (
              <NaveLink onClick={()=>{pathname!==item.route && setLoaderDash(true)}} key={item.id} active={isActive.toString()} to={item.route}>
                <p>{item.text}</p>
                {isActive && <BottomBar />}
              </NaveLink>
            )
            return null

          })}
          </div>


          {/* <div className={classes.grow} /> */}
          <div className={classes.sectionDesktop}>
            {navList.map((item, index) => (
              <div key={item.text}>
              { item.visible === 'all' || (currentUser?.access && item.visible.includes(currentUser.access)) ?
                <ReactLink onClick={item?.onClick ?()=>notification.modal({title: 'Notifição',type:'inform',icon:'success',text:'Notifição padrão do sistema',open:true,onClick:()=>console.log('notification confirm')}):()=>notification.success({message:'Em construção'})} to={item.to} style={{margin:'0px 5px'}}>
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
            {itemsProfile.map((item, index) => {

              const IsVisibleAndHasPermission = !item?.visible ? true : item.visible.some(permission=>currentUser.permission && currentUser.permission.includes(permission))
              if (!IsVisibleAndHasPermission) return null
              return (
                <div onClick={()=>onProfileClick(item.onClick)} className={classes.boxItem} key={item.text} >
                    <Icons className={classes.icons} type={item.icon}/>
                    <p style={{color:themes.palette.text.secondary,fontSize:'15px',marginRight:20}} >{item.text}</p>
                </div>
              )
            })}
          </RichTooltip>

          <div onClick={()=>setOpenProfile(true)} className={classes.divName}>
            <p className={classes.profileName} style={{fontSize:17}}>
              {currentUser?.name ? AbreviarNome(currentUser.name,22) : 'Sem Identificação'}
            </p>
            {/* <p className={classes.profileName} style={{fontSize:8}}>
              {currentUser?.company && currentUser.company?.name ? currentUser.company.name : 'Individual'}
            </p> */}
          </div>
          <AvatarView forwardRef={anchorRef} onClick={()=>setOpenProfile(true)} navbar user={currentUser}/>



        </div>
      </AppBar>
  );
};

export default NavBar;

// <div ref={anchorRef} onClick={()=>setOpenProfile(true)} className={classes.profileContainer}>
//   {!currentUser?.photoURL ?
//     <div className={classes.profile}>
//       <div>
//         <p className={classes.profileCircleName} style={{fontSize:17}}>
//           {currentUser?.name ? InitialsName(currentUser.name,22) : 'SI'}
//         </p>
//       </div>
//         {/* <Icons className={classes.profileCircleName} type={'Person'}/> */}
//     </div>
//   :
// <div className={classes.profileImg}>
//   <img style={{height:52,width:52,borderRadius:50}} src={currentUser.photoURL} alt={'perfil_photo'} />
// </div>
// }
// </div>
