import dayjs from "dayjs";
import { TimeCard } from "@/components/time-card";
import {
  CompetitionDriver,
  CompetitionTeam,
  EventGroup,
} from "@/features/competitions/types";
import { RankingItem } from "../types";

export interface RankingRowProps {
  rankingItem?: RankingItem | null;
  driver: CompetitionDriver | null;
  team: CompetitionTeam | null;
  eventGroups: EventGroup[] | null;
}

export function RankingRow({
  eventGroups,
  rankingItem,
  driver,
  team,
}: RankingRowProps) {
  if (!rankingItem) {
    return null;
  }

  return (
    <tr className="border-b border-gray-700 bg-gray-800">
      <td className="px-6 py-4 text-center">P{rankingItem.position}</td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {driver?.firstName}
          {driver?.lastName}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex flex-row">
            {team?.pictureUrl && (
              <img
                src={team.pictureUrl}
                alt={team.name}
                className="mr-4 h-6 w-6 object-cover"
              />
            )}
            <span>{team?.name}</span>
          </div>
        </div>
      </td>

      <td className="px-2 py-1">
        <TimeCard time={rankingItem.sum} />
      </td>

      {eventGroups &&
        eventGroups.map((event, eventIndex) => {
          const eventResults = rankingItem.results[eventIndex];

          return event.sessions.map((session, i) => {
            const sessionResult =
              eventResults?.[
                dayjs(session.fromTime.toDate()).format("YYYY-MM-DD")
              ];

            return (
              <td key={i} className="px-2 py-1">
                <TimeCard time={sessionResult} />
              </td>
            );
          });
        })}
    </tr>
  );
}
