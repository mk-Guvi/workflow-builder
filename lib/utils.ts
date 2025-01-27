import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateToDayMonthTime = (dateString:string) => {
  const date = new Date(dateString);
  
  // Extract date and time components
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }); // Short month name (e.g., Jan, Feb)
  const time = date.toLocaleTimeString('en-US', { hour12: false }); // Time in 24-hour format
  
  return `${day} ${month} at ${time}`;
};

interface TimeDifference {
  seconds: number;  // 0-59
  minutes: number;  // 0-59
  hours: number;    // 0-23
  days: number;     // unlimited
}

export function getDateDifference({ fromDate, toDate }: { fromDate: string, toDate: string }): TimeDifference {
 
  if (new Date(fromDate) > new Date(toDate)) {
      [fromDate, toDate] = [toDate, fromDate];
  }

  // Get the difference in milliseconds
  const diffInMs = new Date(toDate).getTime() - new Date(fromDate).getTime();

  // Calculate total seconds first
  const totalSeconds = Math.floor(diffInMs / 1000);

  // Calculate each unit
  const seconds = totalSeconds % 60;  // Gets remainder after dividing by 60
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;  // Gets remainder after dividing by 60
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;      // Gets remainder after dividing by 24
  const days = Math.floor(totalHours / 24);

  return {
      seconds,
      minutes,
      hours,
      days
  };
}
