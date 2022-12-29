import { v4 } from "uuid";

// Sugar coding syntax for uuid
export const uuid = () => v4();

const formatDateToDateString = (inputDate) => {
  const theDate = inputDate.getDate();
  const theMonth = inputDate.getMonth() + 1;
  const month = theMonth < 10 ? `0${theMonth}` : theMonth;
  const yearMonth = `${inputDate.getFullYear()}-${month}`;
  return `${yearMonth}-${theDate < 10 ? `0${theDate}` : theDate}`;
};

export const getToday = () => {
  let now = new Date();
  return formatDateToDateString(now);
};

export const getDateBeforeDate = (date) => {
  let d = new Date(date);
  d.setDate(d.getDate() - 1);
  return formatDateToDateString(d);
};

export const getDateAfterDate = (date) => {
  let d = new Date(date);
  d.setDate(d.getDate() + 1);
  return formatDateToDateString(d);
};

// timeToCheck in format: HH:mm
export const isTimePassed = (timeToCheck) => {
  // return false; // Quickest way to enable all "closed" actions
  const today = getToday();
  const dateString = `${today}T${timeToCheck}:00`;
  const endTimestamp = new Date(dateString).getTime();
  return endTimestamp < Date.now();
};

export const isTimestampToday = (timestamp) => {
  let todayStart = new Date(getToday());
  return todayStart.getTime() < timestamp.getTime();
};

export const ONE_MINUTE_IN_MS = 60000;

export const hashCode = (value) => {
  var hash = 0,
    i,
    chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const hash64 = (str) => {
  var i = str.length;
  var hash1 = 5381;
  var hash2 = 52711;

  while (i--) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  return (hash1 >>> 0) * 4096 + (hash2 >>> 0);
};
