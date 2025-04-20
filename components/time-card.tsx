import { formatMilliseconds } from "@/lib/format";
import clsx from "clsx";

export interface TimeCardProps {
  time?: number;
  isOverallBest?: boolean;
  isPersonalBest?: boolean;
}

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
  );
}
