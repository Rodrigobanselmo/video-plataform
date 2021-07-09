export const HOME = '/';
export const SIGN = '/login';
export const DASHBOARD = '/app';
export const VERIFY_EMAIL = '/verificar-email';
export const ADMIN = `${DASHBOARD}/admin`;
export const HOME_ADMIN = `${ADMIN}/home`;


export const VIDEO = `${ADMIN}/video/:cursoId/:moduleId?/:classId?`;
export const ALL_VIDEO = `${ADMIN}/video`;
export const DOWNLOAD = `${ADMIN}/download`;
export const CALENDAR_ADMIN = `${ADMIN}/calendar`;
export const CALENDAR_CONECTOR = `${ADMIN}/calendar-conector`;
export const ADMIN_PERFIL = `${ADMIN}/perfil`;
export const ADMIN_PERFIL_EDIT = `${ADMIN}/perfil/:userId`;
export const ADMIN_PROFESSION = `${ADMIN}/data/profissao`;
export const TEAM = `${ADMIN}/equipe`;
export const CLIENTS = `${ADMIN}/clients`;
export const REQUEST_DATA = `/request/data`;
// export const NO_AUTH = '/sem-autenticacao';
// export const GET_USER_DATA = `${SIGN}/insercao-de-dados`;
