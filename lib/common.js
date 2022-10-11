import { v4 } from "uuid";

// Sugar coding syntax for uuid
export const uuid = () => v4();

export const getToday = () => {
  let now = new Date();
  const nowDate = now.getDate();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${
    nowDate < 10 ? `0${nowDate}` : nowDate
  }`;
};
