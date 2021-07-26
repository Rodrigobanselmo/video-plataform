import { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: FieldError;
  pr?: number;
}

export interface IForm {
  isInvalid: boolean;
}
