import { formatMilliseconds } from "@/lib/format";

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
      className="h-full w-full rounded p-3 text-center font-mono text-gray-300"
      class:bg-purple-600={isOverallBest}
      class:text-purple-200={isOverallBest}
      class:bg-green-600={isPersonalBest && !isOverallBest}
      class:text-green-200={isPersonalBest && !isOverallBest}
    >
      {time ? formatMilliseconds(time) : "-"}
    </div>
  );
}
