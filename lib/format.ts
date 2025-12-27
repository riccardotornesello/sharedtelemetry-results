import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

// Extend dayjs with the duration plugin
dayjs.extend(duration)

/**
 * Formats milliseconds into a readable time string in the format "m:ss.SSS"
 *
 * @param totalMilliseconds - The time in milliseconds to format
 * @returns Formatted time string (e.g., "2:15.423" for 135423ms)
 *
 * @example
 * ```ts
 * formatMilliseconds(135423) // Returns "2:15.423"
 * formatMilliseconds(61234)  // Returns "1:01.234"
 * ```
 */
export function formatMilliseconds(totalMilliseconds: number): string {
  const durationObj = dayjs.duration(Math.floor(totalMilliseconds))
  return durationObj.format("m:ss.SSS")
}

/**
 * Formats an ISO date string into a short date format "DD/MM"
 *
 * @param ts - ISO 8601 date string
 * @returns Formatted date string (e.g., "25/12" for December 25th)
 *
 * @example
 * ```ts
 * formatDate("2024-12-25T10:00:00Z") // Returns "25/12"
 * ```
 */
export function formatDate(ts: string): string {
  return dayjs(ts).format("DD/MM")
}
