import { LogOut } from '../services/firebaseAuth';
import { useLoaderScreen } from '../context/LoaderContext';

export const itemsProfile = [
  {
    text: 'Meu Perfil',
    icon: 'Person',
    onClick: 'perfil',
  },
  {
    text: 'Central de e-mails',
    icon: 'Email',
    visible: ['ea'],
    onClick: 'email',
  },
  {
    text: 'Assinar Certificados',
    icon: 'Certification',
    visible: ['ea', 'su', 'pr'],
    onClick: 'certification',
  },
  {
    text: 'Chat de Alunos',
    visible: ['ea', 'su'],
    icon: 'Chat',
    onClick: 'chat',
  },
  {
    text: 'Comentários',
    visible: ['ea', 'su'],
    icon: 'Chat',
    onClick: 'comment',
  },
  {
    text: 'Finanças',
    visible: ['ea', 'fi'],
    icon: 'Money',
    onClick: 'finance',
  },
  {
    text: 'Fatura',
    icon: 'History',
    visible: ['co'],
    onClick: 'statement',
  },
  {
    text: 'Logout',
    icon: 'ExitToApp',
    onClick: 'logout',
  },
];
