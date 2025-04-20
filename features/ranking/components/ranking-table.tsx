import { Competition, CompetitionDriver } from "@/features/competitions/types";
import { RankingRow } from "./ranking-row";
import { RankingItem } from "../types";
import { formatTimestampDate } from "@/lib/format";

export interface RankingProps {
  competition?: Competition;
  ranking?: RankingItem[];
  drivers?: CompetitionDriver[];
  driversTeamMap?: any;
}

export function RankingTable({
  competition,
  ranking,
  drivers,
  driversTeamMap,
}: RankingProps) {
  if (!competition || !ranking || ranking.length === 0) {
    return <div>No ranking available</div>;
  }

  return (
    <table className="min-w-full table-auto text-left text-sm text-gray-400 rtl:text-right">
      <thead className="bg-gray-700 text-center text-xs uppercase text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-2" rowSpan={2} colSpan={2}>
            Pilota
          </th>
          <th scope="col" className="px-6 py-2" rowSpan={2}>
            Team
          </th>
          <th scope="col" className="px-6 py-2" rowSpan={2}>
            Tot
          </th>
          {competition.eventGroups.map((eventGroup, i) => (
            <th
              key={i}
              scope="col"
              className="px-6 py-2"
              colSpan={eventGroup.sessions.length}
            >
              {eventGroup.name}
            </th>
          ))}
        </tr>

        <tr>
          {competition.eventGroups.map((eventGroup) =>
            eventGroup.sessions.map((session, i) => (
              <th key={i} scope="col" className="px-6 py-2">
                {formatTimestampDate(session.fromTime)}
              </th>
            ))
          )}
        </tr>
      </thead>

      <tbody>
        {ranking.map((rankingItem, i) => (
          <RankingRow
            key={i}
            rankingItem={rankingItem}
            driver={null} // TODO
            team={null} // TODO
            eventGroups={competition.eventGroups}
          />
        ))}
      </tbody>
    </table>
  );
}
