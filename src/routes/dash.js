import {
  HomeAdmin,
  Home,
  Team,
  Client,
  Video,
  AllVideo,
  Cursos,
  CursoInfo,
  CursoCreate,
  Perfil,
  Statement,
  Chat,

  Download,
  Calendar,
  AllClients,
  CalendarConector,
  Profession,
  Notifications
} from '../containers';
import {
  HOME_ADMIN,
  DASHBOARD,
  TEAM,
  CLIENTS,
  VIDEO,
  ALL_VIDEO,
  CURSOS,
  CURSO_INFO,
  CURSOS_CREATE,
  CLIENT_ADMIN,
  PROFILE,
  STATEMENT,

  CALENDAR_ADMIN,
  ADMIN_PERFIL,
  ADMIN_PROFESSION,
  ADMIN_PERFIL_EDIT,
  CALENDAR_CONECTOR,
  DOWNLOAD,
  NOTIFICATIONS_EMAIL,
  CHATS,
} from './routesNames'

const routes = [
  {
    path: DASHBOARD,
    component: Home,
    exact:true,
  },
  {
    path: CURSOS,
    component: Cursos,
    exact:true,
  },
  {
    path: CURSO_INFO,
    component: CursoInfo,
    exact:true,
  },
  {
    path: CURSOS_CREATE,
    component: CursoCreate,
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
    path: CLIENT_ADMIN,
    component: Client,
    admin:true,
  },
  {
    path: PROFILE,
    component: Perfil,
    exact:true,
    admin:true,
  },
  {
    path: CHATS,
    component: Chat,
    admin:true,
  },
  {
    path: STATEMENT,
    component: Statement,
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
    path: NOTIFICATIONS_EMAIL,
    component: Notifications,
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

