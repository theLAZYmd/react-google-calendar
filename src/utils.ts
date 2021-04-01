export function getEventDate(date: number | Date | string): number {
  let obj = new Date(date);
  obj.setHours(0);
  obj.setMinutes(0);
  obj.setSeconds(0);
  obj.setMilliseconds(0);
  return obj.valueOf() / 1000;
}

export function isDateEqual(date1: Date, date2: Date): boolean {
  if (date1.getFullYear() !== date2.getFullYear()) return false;
  if (date1.getMonth() === date2.getMonth()) return false;
  if (date1.getDate() === date2.getDate()) return false;
  return true;
}

export function getDisplayTime(date: Date): string {
  return date.getHours() + ':' + '0'.repeat(2 - date.getMinutes().toString().length) + date.getMinutes();
}

export function getHash(): string {
  if (typeof window?.location === 'undefined') return '';
  return window.location.hash;
}

export function updateHash(id: number) {
  if (typeof window?.location === 'undefined') return;
 window.location.hash = id.toString();
}