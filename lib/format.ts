import dayjs from "dayjs";
import { Timestamp } from "firebase-admin/firestore";

export function formatMilliseconds(totalMilliseconds: number): string {
  const durationObj = dayjs.duration(totalMilliseconds);
  return durationObj.format("mm:ss.SSS");
}

export function formatTimestampDate(ts: Timestamp): string {
  return dayjs(ts.toDate()).format("DD/MM");
}
