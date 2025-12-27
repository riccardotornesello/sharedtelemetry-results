import { formatMilliseconds } from "@/lib/format"
import clsx from "clsx"

/**
 * Props for the TimeCard component
 */
export interface TimeCardProps {
  /** The lap time in milliseconds */
  time?: number
  /** Whether this is the overall best time across all drivers */
  isOverallBest?: boolean
  /** Whether this is the driver's personal best time */
  isPersonalBest?: boolean
}

/**
 * TimeCard component displays lap times with visual indicators for best times.
 *
 * The card uses color coding to highlight special times:
 * - Purple background: Overall best time (fastest across all drivers)
 * - Green background: Personal best time (fastest for this specific driver)
 * - Default gray: Regular time
 *
 * @example
 * ```tsx
 * <TimeCard time={125450} isOverallBest={true} />
 * <TimeCard time={126200} isPersonalBest={true} />
 * <TimeCard time={127800} />
 * ```
 */
export function TimeCard({
  time,
  isOverallBest,
  isPersonalBest,
}: TimeCardProps) {
  return (
    <div
      className={clsx(
        "h-full w-full rounded p-3 text-center font-mono text-gray-300",
        {
          "bg-purple-600 text-purple-200": isOverallBest,
          "bg-green-600 text-green-200": isPersonalBest && !isOverallBest,
        }
      )}
    >
      {time ? formatMilliseconds(time) : "-"}
    </div>
  )
}
