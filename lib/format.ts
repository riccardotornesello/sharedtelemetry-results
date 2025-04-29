import dayjs from "dayjs";

export function formatMilliseconds(totalMilliseconds: number): string {
  const durationObj = dayjs.duration(Math.floor(totalMilliseconds));
  return durationObj.format("m:ss.SSS");
}

export function formatDate(ts: string): string {
  return dayjs(ts).format("DD/MM");
}
