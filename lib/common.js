import { v4 } from "uuid";

// Sugar coding syntax for uuid
export const uuid = () => v4();

export const getToday = () => {
  let now = new Date();
  const nowDate = now.getDate();
  const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
  return `${yearMonth}-${nowDate < 10 ? `0${nowDate}` : nowDate}`;
};

export const isTimePassed = (timeToCheck) => {
  // timeToCheck in format: HH:mm
  const today = getToday();
  const dateString = `${today}T${timeToCheck}:00`;
  const endTimestamp = new Date(dateString).getTime();
  return endTimestamp < Date.now();
};

export const ONE_MINUTE_IN_MS = 60000;
