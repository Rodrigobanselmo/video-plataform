export interface IUser {
  name: string;
  email: string;
  uid: string;
  cpf: string;
  cnpj?: string;
  razao?: string;
  photoURL?: string | null;
  permission?: string[];
}
