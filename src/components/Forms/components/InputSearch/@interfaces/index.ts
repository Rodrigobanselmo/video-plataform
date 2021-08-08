import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

export interface IOptions {
  uid: string;
  name: string;
  cpf: string;
  email: string;
}

export interface IRow extends ButtonHTMLAttributes<HTMLButtonElement> {
  item: IOptions;
  // onHandleSelect: (data: IOptions) => void;
}

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  options: IOptions[];
  filter: (data: IOptions[], search: string) => Promise<IOptions[]>;
  onSelectItem: (user: IOptions, onClose: () => void) => void;
  label?: string;
  error?: FieldError;
  pr?: number;
  row: (data: IRow) => JSX.Element;
}

export interface IForm {
  isInvalid: boolean;
}

export interface ISearch {
  empty?: boolean;
}
