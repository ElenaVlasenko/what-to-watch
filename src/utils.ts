import { SerializedError } from '@reduxjs/toolkit';
import { intervalToDuration } from 'date-fns';
import { isNil } from 'lodash';
import { MILLISECONDS_IN_SECOND } from './const';
import { AxiosError } from 'axios';

export function getRatingName(rating: number): string {
  switch (true) {
    case (rating <= 3): return 'Bad';
    case (rating <= 5): return 'Normal';
    case (rating <= 8): return 'Good';
    case (rating < 10): return 'Very good';
    default: return 'Awesome';
  }
}

const requiredNumberLength = 2;

function toDigitStr(n: number) {
  const numberStr = n.toString();

  return numberStr.length < requiredNumberLength ? `0${numberStr}` : numberStr;
}

export function getRunTime(runTime: number): string {
  const { hours, seconds, minutes } = intervalToDuration({ start: 0, end: runTime * MILLISECONDS_IN_SECOND });
  const timing = [hours, minutes ?? 0, seconds ?? 0].filter((it) => !isNil(it)) as number[];

  return `${timing.map(toDigitStr).join(':')}`;
}

const NOT_FOUND_STATUS = 404;

export function isNotFoundError(err: SerializedError): boolean {
  return err.message?.includes(NOT_FOUND_STATUS.toString()) ?? false;
}

export function isAxiosNotFoundError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === NOT_FOUND_STATUS;
}
