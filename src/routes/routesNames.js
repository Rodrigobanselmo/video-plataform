export const HOME = '/';
export const SIGN = '/login';
export const DASHBOARD = '/app';
export const VERIFY_EMAIL = '/verificar-email';

export const ADMIN = `${DASHBOARD}/admin`;
export const HOME_ADMIN = `${ADMIN}/home`;
export const CLIENT_ADMIN = `${ADMIN}/client`;
export const CURSOS_CREATE = `${ADMIN}/cursos/create`;
export const NOTIFICATIONS_EMAIL = `${ADMIN}/notificacoes-email`;
export const CHATS = `${ADMIN}/chats/:userId?`;

export const CURSOS = `${DASHBOARD}/cursos`;
export const CURSO_INFO = `${DASHBOARD}/cursos/:cursoId`;
export const VIDEO_ROUTE = `${DASHBOARD}/video`;
export const VIDEO = `${VIDEO_ROUTE}/:cursoId/:moduleId?/:classId?`;
export const TEAM = `${DASHBOARD}/equipe`;
export const PROFILE = `${DASHBOARD}/perfil`;
export const STATEMENT = `${DASHBOARD}/fatura`;

export const TEAM_ADMIN = `${ADMIN}/equipe`;
export const ALL_VIDEO = `${ADMIN}/video`;
export const DOWNLOAD = `${ADMIN}/download`;
export const CALENDAR_ADMIN = `${ADMIN}/calendar`;
export const CALENDAR_CONECTOR = `${ADMIN}/calendar-conector`;
export const ADMIN_PERFIL = `${ADMIN}/perfil`;
export const ADMIN_PERFIL_EDIT = `${ADMIN}/perfil/:userId`;
export const ADMIN_PROFESSION = `${ADMIN}/data/profissao`;
export const CLIENTS = `${ADMIN}/clients`;
export const REQUEST_DATA = `/request/data`;
// export const NO_AUTH = '/sem-autenticacao';
// export const GET_USER_DATA = `${SIGN}/insercao-de-dados`;
