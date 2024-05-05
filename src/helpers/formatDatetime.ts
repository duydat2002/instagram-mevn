import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  format,
  isSameYear,
  differenceInDays,
} from "date-fns";
import { vi } from "date-fns/locale";

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function dateDistanceToNow(
  date: Date | string,
  suffix: boolean = true,
  helper: boolean = true
) {
  const now = new Date();
  if (!(date instanceof Date)) date = new Date(date);

  if (differenceInDays(now, date) <= 7) {
    if (!helper) return formatDistanceToNowStrict(date, { locale: vi, addSuffix: suffix });
    else return capitalizeFirst(formatDistanceToNow(date, { locale: vi, addSuffix: suffix }));
  } else if (isSameYear(date, now)) {
    return capitalizeFirst(format(date, "MMMM d", { locale: vi }));
  } else {
    return capitalizeFirst(format(date, "MMMM d, yyyy", { locale: vi }));
  }
}

export function dateDistanceToNowMaxWeek(
  date: Date | string,
  suffix: boolean = true,
  helper: boolean = true
) {
  const now = new Date();
  if (!(date instanceof Date)) date = new Date(date);

  if (differenceInDays(now, date) <= 7) {
    if (!helper) return formatDistanceToNowStrict(date, { locale: vi, addSuffix: suffix });
    else return capitalizeFirst(formatDistanceToNow(date, { locale: vi, addSuffix: suffix }));
  } else {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const week = Math.abs(Math.round((now.getTime() - date.getTime()) / millisecondsPerWeek));
    return `${week} tuần`;
  }
}

export function convertToFullDate(date: Date | string) {
  return capitalizeFirst(format(date, "MMMM d, yyyy", { locale: vi }));
}
