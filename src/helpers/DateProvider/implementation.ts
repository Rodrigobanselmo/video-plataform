/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { FormatProvider } from './format/implementation';
import { IDateFormatProvider } from './format/model';
import { IDateProvider } from './model';

class DateProvider implements IDateProvider {
  seconds(): number {
    return new Date().getTime();
  }

  format(locale = 'pt-br'): IDateFormatProvider {
    return new FormatProvider(locale);
  }
}
export { DateProvider };
