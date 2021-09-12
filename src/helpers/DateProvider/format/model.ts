export interface IDateFormatProvider {
  long(date?: Date | number | string): string;
  short(date?: Date | number | string): string;
  timeAgo(date: Date | number | string): string;
}
