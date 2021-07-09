import { Sign, NotFound, Dashboard, InputData, Verify } from '../pages';
import { SIGN,DASHBOARD,REQUEST_DATA,VERIFY_EMAIL } from './routesNames';

const routes = [
  {
    path: SIGN,
    component: Sign,
    exact: true,
  },
  {
    path: VERIFY_EMAIL,
    component: Verify,
    isPrivate: true,
    privateRoute: SIGN,
  },
  {
    path: DASHBOARD,
    component: Dashboard,
    isPrivate: true,
    privateRoute: SIGN,
    // privateRoute: GET_USER_DATA, // caso precise de mais rotas criar uma especifica pra isso e mandar um param
    // infoUser: ['name', 'status'],
    // condition: ['', 'Ativo'],
    // Equal: [false, true],
  },
  {
    path: REQUEST_DATA,
    component: InputData,
    isPrivate: true,
    // isPrivate: true,
    // privateRoute: SIGN,
  },
  // {
  //   path: GET_USER_DATA,
  //   component: inputUserData,
  //   // isPrivate: true,
  //   // privateRoute: NO_AUTH,
  //   // infoUser: ['name', 'status'],
  //   // condition: ['', 'Ativo'],
  //   // Equal: [true, true],
  // },

  {
    path: '*',
    component: NotFound,
  },
];

export default routes;
