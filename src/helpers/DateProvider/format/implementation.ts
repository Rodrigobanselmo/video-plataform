/* eslint-disable no-plusplus */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
import { IDateFormatProvider } from './model';

class FormatProvider implements IDateFormatProvider {
  public locale = 'pt-BR';

  constructor(language?: string) {
    if (language) this.locale = language;
  }

  timeAgo(date: number | Date): string {
    const formatter = new Intl.RelativeTimeFormat('pt', {
      numeric: 'auto',
    });

    const DIVISIONS = [
      { amount: 60, name: 'seconds' },
      { amount: 60, name: 'minutes' },
      { amount: 24, name: 'hours' },
      { amount: 7, name: 'days' },
      { amount: 4.34524, name: 'weeks' },
      { amount: 12, name: 'months' },
      { amount: Number.POSITIVE_INFINITY, name: 'years' },
    ];

    let duration = (new Date(date).getTime() - new Date().getTime()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(
          Math.round(duration),
          division.name as Intl.RelativeTimeFormatUnit,
        );
      }
      duration /= division.amount;
    }
    return this.short(date);
  }

  long(date?: number | Date): string {
    let newDate = date;

    if (!(newDate instanceof Date) && date) {
      newDate = new Date(date);
    }

    if (!newDate) {
      newDate = new Date();
    }

    const format = Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(newDate);

    return format;
  }

  short(date?: number | Date): string {
    let newDate = date;

    if (!(newDate instanceof Date) && date) {
      newDate = new Date(date);
    }

    if (!newDate) {
      newDate = new Date();
    }
    console.log(newDate);
    const format = Intl.DateTimeFormat(this.locale, {}).format(newDate);

    return format;
  }
  // seconds(): number {
  //   return new Date().getTime();
  // }
  // format(date?: Date): string {
  //   const format = Intl.DateTimeFormat('pt-BR', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //   }).format(date);
  //   return format;
  // }
}
export { FormatProvider };
