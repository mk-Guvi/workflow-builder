import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToDayMonthTime = (dateString: string, timeZone: string = moment.tz.guess()) => {
  const date = moment.tz(dateString, "UTC").tz(timeZone);

  // Extract date and time components
  const day = date.date();
  const month = date.format("MMM"); // Short month name (e.g., Jan, Feb)
  const time = date.format("HH:mm:ss"); // Time in 24-hour format

  return `${day} ${month} at ${time}`;
};

interface TimeDifference {
  seconds: number; // 0-59
  minutes: number; // 0-59
  hours: number; // 0-23
  days: number; // unlimited
}

export function getDateDifference({ fromDate, toDate, timeZone }: { fromDate: string; toDate: string; timeZone?: string }): TimeDifference {
  timeZone = timeZone || moment.tz.guess();
  
  let from = moment.tz(fromDate, "UTC").tz(timeZone);
  let to = moment.tz(toDate, "UTC").tz(timeZone);
  
  if (from.isAfter(to)) {
    [from, to] = [to, from];
  }

  // Get the difference
  const duration = moment.duration(to.diff(from));

  return {
    seconds: duration.seconds(),
    minutes: duration.minutes(),
    hours: duration.hours(),
    days: duration.days(),
  };
}

export const getCurrentUTC = (): string => {
  return moment.utc().format();
};


export   function isJsonValue(value: unknown): boolean {
  if (value === null) return true;
  if (['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === 'object') {
    return Object.values(value as object).every(isJsonValue);
  }
  return false;
}