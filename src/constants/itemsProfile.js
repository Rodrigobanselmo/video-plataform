import {LogOut} from '../services/firebaseAuth'
import {useLoaderScreen} from '../context/LoaderContext'


export const itemsProfile = [
    {
      text: "Meu Perfil",
      icon: 'Person',
      onClick: 'perfil'
    },
    {
      text: "Fatura",
      icon: 'History',
      visible:['co'],
      onClick: 'statement'
    },
    {
      text: "Logout",
      icon: 'ExitToApp',
      onClick: 'logout',
    }
  ];
