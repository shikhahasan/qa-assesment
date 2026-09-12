import { faker } from '@faker-js/faker';

const pad = (n: number) => String(n).padStart(2, '0');
export function formatDate(date: Date, pattern = 'yyyy-mm-dd'): string {
  return pattern
    .replace('yyyy', String(date.getFullYear()))
    .replace('mm', pad(date.getMonth() + 1))
    .replace('dd', pad(date.getDate()));
}

export const toIsoDate = (date: Date) => formatDate(date, 'yyyy-mm-dd');

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
export function randomWeekday(from: Date, to: Date, weekdays = [1, 2, 3, 4, 5]): Date {
  const candidates: Date[] = [];
  for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
    if (weekdays.includes(d.getDay())) candidates.push(new Date(d));
  }
  if (!candidates.length) throw new Error(`No matching weekday between ${toIsoDate(from)} and ${toIsoDate(to)}`);
  return faker.helpers.arrayElement(candidates);
}
