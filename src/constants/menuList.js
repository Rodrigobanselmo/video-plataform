import {TEAM,HOME_ADMIN} from '../routes/routesNames'

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
    route:TEAM,
    id:Math.random(),
  },
  {
    text: "Cursos",
    visible:'all',
    route:TEAM,
    id:Math.random(),
  },
  {
    text: "Equipe",
    visible:'all',
    route:TEAM,
    id:Math.random(),
  },
  {
    text: "Clientes",
    visible:'all',
    route:TEAM,
    id:Math.random(),
  },
  {
    text: "Loja",
    visible:'all',
    route:TEAM,
    id:Math.random(),
  },
];
