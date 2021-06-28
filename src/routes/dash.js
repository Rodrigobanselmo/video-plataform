import { HomeAdmin,Home,Team,Calendar,Perfil,Profession,AllClients,CalendarConector,Download,Video,AllVideo } from '../containers';
import {
  HOME_ADMIN,
  DASHBOARD,
  TEAM,
  CALENDAR_ADMIN,
  ADMIN_PERFIL,
  ADMIN_PROFESSION,
  ADMIN_PERFIL_EDIT,
  CLIENTS,
  CALENDAR_CONECTOR,
  DOWNLOAD,
  VIDEO,
  ALL_VIDEO
} from './routesNames'

const routes = [
  {
    path: DASHBOARD,
    component: Home,
    exact:true,
  },
  {
    path: ALL_VIDEO,
    component: AllVideo,
    exact:true,
  },
  {
    path: VIDEO,
    component: Video,
    exact:true,
  },
  {
    path: HOME_ADMIN,
    component: HomeAdmin,
    admin:true,
  },
  {
    path: ADMIN_PERFIL,
    component: Perfil,
    exact:true,
    admin:true,
  },
  {
    path: ADMIN_PERFIL_EDIT,
    component: Perfil,
    exact:true,
    admin:true,
  },
  {
    path: ADMIN_PROFESSION,
    component: Profession,
    admin:true,
  },
  {
    path: CALENDAR_ADMIN,
    component: Calendar,
    admin:true,
  },
  {
    path: CALENDAR_CONECTOR,
    component: CalendarConector,
    admin:true,
  },
  {
    path: DOWNLOAD,
    component: Download,
    admin:true,
  },
  {
    path: TEAM,
    component: Team,
    exact:true,
    //isPrivate:true,
    //privateRoute:DASHBOARD,
    //infoUser:['access'],
    //condition:[['admin','master']],
    //Equal:[true],
  },
  {
    path: CLIENTS,
    component: AllClients,
    exact:true,
    //isPrivate:true,
    //privateRoute:DASHBOARD,
    //infoUser:['access'],
    //condition:[['admin','master']],
    //Equal:[true],
  },
];


export default routes

