import {TEAM,HOME_ADMIN, VERIFY_EMAIL, CLIENT_ADMIN, CURSOS, DASHBOARD} from '../routes/routesNames'

export const menuList = [

  {
    text: "Home",
    visible:'admin',
    route:HOME_ADMIN,
    id:Math.random(),
  },
  {
    text: "Home",
    visible:'client',
    route:DASHBOARD,
    id:Math.random(),
  },
  {
    text: "Cursos",
    visible:'all',
    route: CURSOS,
    contain: ['cursos'],
    id:Math.random(),
  },
  {
    text: "Equipe",
    visible:'all',
    permissions:['ea','co'],
    route:TEAM,
    id:Math.random(),
  },
  // {
  //   text: "Equipe",
  //   visible:'client',
  //   route:TEAM_CLIENT,
  //   id:Math.random(),
  // },
  {
    text: "Clientes",
    visible:'admin',
    permissions:['ea'],
    route: CLIENT_ADMIN,
    id:Math.random(),
  },
  {
    text: "Loja",
    visible:'all',
    route: VERIFY_EMAIL,
    id:Math.random(),
  },
];
