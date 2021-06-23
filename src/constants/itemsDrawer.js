import {
  HOME_ADMIN,
  TEAM,
  CALENDAR_ADMIN,
  DOWNLOAD,
  ADMIN_PROFESSION,
  CLIENTS,
  CALENDAR_CONECTOR
} from '../routes/routesNames'

const itemsList = [
  {
    text: "Home",
    description:'Página principal',
    to:HOME_ADMIN,
    icon: 'Apps',
    id:HOME_ADMIN,
    onClick: () => {}
  },
  {
    text: "Equipe",
    description:'Gerenciar equipe',
    to:TEAM,
    icon: 'Group',
    id:TEAM,
    onClick: () => {}
  },
  {
    text: "Profissões",
    description:'Gerenciar profissões e atividade',
    to:ADMIN_PROFESSION,
    icon: 'Work',
    id:ADMIN_PROFESSION,
    onClick: () => {}
  },
  {
    text: "Clientes",
    // description:'Gerenciar profissões e atividade',
    to:CLIENTS,
    icon: 'Client',
    id:CLIENTS,
    onClick: () => {}
  },
  {
    text: "Agenda",
    description:'Gerenciamento da agenda de horários e afazeres',
    to:CALENDAR_ADMIN,
    icon: 'Calendar',
    id:CALENDAR_ADMIN,
    onClick: () => {}
  },
  {
    text: "Download",
    description:'Download de arquivos',
    to:DOWNLOAD,
    icon: 'CloudDownload',
    id:DOWNLOAD,
    onClick: () => {}
  },
  {
    text: "Horarios",
    description:'Horarios de atendimento das equipes',
    to:CALENDAR_CONECTOR,
    icon: 'Clock',
    id:CALENDAR_CONECTOR,
    onClick: () => {}
  },
];

export const lists = [
  {
    category: "Geral",
    id:Math.random(),
    search:'Geral principal dashboard',
    text:'Geral principal dashboard',
    items: itemsList
  },
];


