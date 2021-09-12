import { IDateFormatProvider } from './format/model';

export interface IDateProvider {
  seconds(): number;
  format(locale?: string): IDateFormatProvider;
}
