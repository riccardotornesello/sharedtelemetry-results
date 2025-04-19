import dayjs from "dayjs";

export function formatMilliseconds(totalMilliseconds: number): string {
  const durationObj = dayjs.duration(totalMilliseconds);
  return durationObj.format("mm:ss.SSS");
}
