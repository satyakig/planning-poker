import { v4 } from 'uuid';
import moment from 'moment';

export function randomId(): string {
  return v4();
}

export function now(): number {
  return moment().valueOf();
}
