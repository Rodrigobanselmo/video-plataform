import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { NavLogo } from '../../Main/NavLogo';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpen from '@material-ui/icons/MenuOpen';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import RichTooltip from '../Components/MultUsage/RichTooltip';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import { Link } from 'react-router-dom';
import { itemsProfile } from '../../../constants/itemsProfile';
import { useLoaderScreen } from '../../../context/LoaderContext';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { navList } from '../../../constants/itemsNav';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import { LogOut } from '../../../services/firebaseAuth';
import { useStyles, DarkModeSwitch as DarkModeSwitchMui } from './styles';
import { onLogout } from './func';
import { Icons } from '../../Icons/iconsDashboard';

import {
  DASHBOARD,
  ADMIN_PERFIL,
  PROFILE,
  STATEMENT,
  NOTIFICATIONS_EMAIL,
  CHATS,
  FINANCE,
} from '../../../routes/routesNames';
import { AbreviarNome, InitialsName } from '../../../helpers/StringHandle';
import usePersistedState from '../../../hooks/usePersistedState.js';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { menuList } from '../../../constants/menuList';
import styled, { css } from 'styled-components';
import { AvatarView } from '../../Main/Avatar';
import { useDebounce } from '../../../hooks/useDebounceJs';
import { toggleWidget } from 'react-chat-widget';

const MenuButton = styled.button`
  position: absolute;
  left: 45px;
  display: flex;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  gap: 0.5rem;
  span {
    display: inline-block;
    border-top: 2px solid #202020;
    border-top-color: #202020;
    width: 20px;
    &:before {
      content: '';
      display: block;
      width: 20px;
      height: 2px;
      background: #202020;
      margin-top: 5px;
      transition: 0.3s;
      position: relative;
    }
    &:after {
      content: '';
      display: block;
      width: 20px;
      height: 2px;
      background: #202020;
      margin-top: 5px;
      transition: 0.3s;
      position: relative;
    }

    ${(props) =>
      props.active &&
      css`
        border-top-color: transparent;
        &:before {
          transform: rotate(135deg);
        }
        &:after {
          transform: rotate(-135deg);
          top: -7px;
        }
      `}
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  padding: 2px 25px;

  @media screen and (max-width: 900px) {
    height: 50px;
    padding: 2px 1rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-left: 60px;
  justify-content: flex-start;
  flex-direction: row;
  position: relative;

  @media screen and (max-width: 900px) {
    margin-left: 0px;
    margin-top: 62px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 10px;
    align-self: flex-start;
    min-width: 200px;
  }
`;

const ContainerNav = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  flex-direction: row;
  position: relative;

  @media screen and (max-width: 900px) {
    margin-left: 0px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    align-self: flex-start;
    min-width: 200px;
  }
`;

const NavArea = styled.div`
  display: block;
  flex-direction: column;
  position: absolute;
  top: 10px;
  height: 200px;
  @media screen and (max-width: 900px) {
  }
`;

const ContainerNavLinks = styled.div`
  display: flex;
  display: block;
  flex-direction: column;
  background-color: red;
  position: relative;

  @media screen and (max-width: 900px) {
  }
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  height: 3px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  @media screen and (max-width: 900px) {
    height: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    width: 3px;
    left: 0;
    bottom: 0;
    top: 0;
  }
`;

const NaveLink = styled(Link)`
  margin: 0px 1.5rem;
  position: relative;
  min-width: 2.5rem;
  display: flex;
  height: 60px;
  font-size: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.palette.text.primary};
  justify-content: flex-start;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
    p {
      transform: scale(1.06);
    }
  }

  p {
    transition: transform 0.3s ease;
  }

  ${(props) =>
    props.active === 'true' &&
    css`
      font-weight: bold;
      opacity: 0.85;
      p {
        transform: scale(1.06) translateX(1px);
      }
      &:hover {
        opacity: 1;
        p {
          transform: scale(1.06) translateX(1px);
        }
      }
    `}

  @media screen and (max-width: 900px) {
    margin: 0.4rem 1.5rem;
    height: 30px;
    width: 100%;
    padding: 0 1rem;
  }
`;

const NavBar = ({ open, setOpen }) => {
  const [openProfile, setOpenProfile] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const anchorRef = React.useRef(null);
  const { setLoaderDash } = useLoaderDashboard();
  const history = useHistory();
  const { pathname } = useLocation();

  const { load, setLoad } = useLoaderScreen();
  //const {setLoadDash,loadDash}= useLoaderDash();
  const notification = useNotification();
  const { currentUser } = useAuth();
  const themes = React.useContext(ThemeContext);
  const [openLinks, setOpenLinks] = useState(false);
  const [dimensionWidth, setDimensionWidth] = useState(window.innerWidth);
  const [onDebounce, onClearDebounce] = useDebounce(
    (value) => setDimensionWidth(value),
    500,
  );

  function ReactLink(props) {
    return (
      <>
        {props.to ? (
          <Link {...props}>{props.children}</Link>
        ) : (
          <div {...props}>{props.children}</div>
        )}
      </>
    );
  }

  React.useEffect(() => {
    function handleResize() {
      onDebounce(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const classes = useStyles();

  function onProfileClick(action) {
    if (action === 'logout') onLogout({ setLoad, notification });
    if (action === 'perfil') {
      if (pathname.includes(PROFILE)) return;
      history.push(PROFILE);
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'statement') {
      if (pathname.includes(STATEMENT)) return;
      history.push(STATEMENT);
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'email') {
      if (pathname.includes(NOTIFICATIONS_EMAIL)) return;
      history.push(NOTIFICATIONS_EMAIL);
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'chat') {
      if (pathname.includes('app/admin/chats')) return;
      history.push('/app/admin/chats');
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'comment') {
      if (pathname.includes('app/admin/comment')) return;
      history.push('/app/admin/comment');
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'certification') {
      if (pathname.includes('app/admin/certification')) return;
      history.push('/app/admin/certification');
      setOpenProfile(false);
      setLoaderDash(true);
    }
    if (action === 'finance') {
      if (pathname.includes(FINANCE)) return;
      history.push(FINANCE);
      setOpenProfile(false);
      setLoaderDash(true);
    }
  }

  const IconClick = (id) => {
    if (id === 'help') {
      toggleWidget();
    } else {
      notification.modal({
        title: 'Notifição',
        type: 'inform',
        icon: 'success',
        text: 'Notifição padrão do sistema',
        open: true,
        onClick: () => console.log('notification confirm'),
      });
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
      <AppContainer>
        <NavLogo to={DASHBOARD} small="true" />

        <MenuButton
          style={{ display: dimensionWidth < 900 ? 'inline-block' : 'none' }}
          onClick={() => setOpenLinks(!openLinks)}
          active={openLinks}
        >
          <span></span>
        </MenuButton>
        <Container>
          <Collapse in={openLinks || dimensionWidth > 900}>
            <ContainerNav>
              {menuList.map((item, index) => {
                function pathActive() {
                  if (item?.contain) {
                    const array = item.contain.map((route) => {
                      return pathname.includes(route);
                    });
                    if (array.findIndex((i) => i === false) !== -1)
                      return false;
                    return true;
                  }
                  return pathname == item.route;
                }
                const isActive = pathActive();

                const isPermissionGranted = !item?.permissions
                  ? true
                  : currentUser?.permission &&
                    currentUser.permission.some((i) =>
                      item.permissions.includes(i),
                    );

                const isAccessGranted =
                  item.visible === 'all' ||
                  (currentUser?.access &&
                    item.visible.includes(currentUser.access));

                if (isPermissionGranted && isAccessGranted)
                  return (
                    <NaveLink
                      onClick={() => {
                        pathname !== item.route && setLoaderDash(true);
                      }}
                      key={item.id}
                      active={isActive.toString()}
                      to={item.route}
                    >
                      <p>{item.text}</p>
                      {isActive && <BottomBar />}
                    </NaveLink>
                  );
                return null;
              })}
            </ContainerNav>
          </Collapse>
        </Container>

        {/* <div className={classes.grow} /> */}
        <div className={classes.sectionDesktop}>
          {navList.map((item, index) => (
            <div key={item.text}>
              {item.visible === 'all' ||
              (currentUser?.access &&
                item.visible.includes(currentUser.access)) ? (
                <ReactLink
                  onClick={() => IconClick(item.id)}
                  to={item.to}
                  style={{ margin: '0px 5px' }}
                >
                  <BootstrapTooltip
                    placement="bottom"
                    TransitionProps={{ timeout: { enter: 500, exit: 50 } }}
                    title={item.text}
                    styletooltip={{ transform: 'translateY(10px)' }}
                  >
                    <IconButton aria-label={item.text}>
                      <Badge badgeContent={0} color="secondary">
                        <Icons type={item.icon} className={classes.iconColor} />
                      </Badge>
                    </IconButton>
                  </BootstrapTooltip>
                </ReactLink>
              ) : null}
            </div>
          ))}
        </div>

        <RichTooltip
          anchorRef={anchorRef}
          open={openProfile}
          setOpen={setOpenProfile}
          translateY={18}
        >
          {itemsProfile.map((item, index) => {
            const IsVisibleAndHasPermission = !item?.visible
              ? true
              : item.visible.some(
                  (permission) =>
                    currentUser.permission &&
                    currentUser.permission.includes(permission),
                );
            if (!IsVisibleAndHasPermission) return null;
            return (
              <div
                onClick={() => onProfileClick(item.onClick)}
                className={classes.boxItem}
                key={item.text}
              >
                <Icons className={classes.icons} type={item.icon} />
                <p
                  style={{
                    color: themes.palette.text.secondary,
                    fontSize: '15px',
                    marginRight: 20,
                  }}
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </RichTooltip>

        <div onClick={() => setOpenProfile(true)} className={classes.divName}>
          <p className={classes.profileName} style={{ fontSize: 17 }}>
            {currentUser?.name
              ? AbreviarNome(currentUser.name, 22)
              : 'Sem Identificação'}
          </p>
          {/* <p className={classes.profileName} style={{fontSize:8}}>
              {currentUser?.company && currentUser.company?.name ? currentUser.company.name : 'Individual'}
            </p> */}
        </div>
        <AvatarView
          forwardRef={anchorRef}
          onClick={() => setOpenProfile(true)}
          navbar
          user={currentUser}
        />
      </AppContainer>
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
