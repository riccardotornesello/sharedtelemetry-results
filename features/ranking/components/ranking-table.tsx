import dayjs from "dayjs";
import { Competition } from "@/payload-types";
import { RankingItem } from "../types";
import { formatDate } from "@/lib/format";
import { TimeCard } from "@/components/time-card";

export interface RankingTableProps {
  competition: Competition;
  ranking: RankingItem[];
}

type CompetitionTeam = NonNullable<Competition["teams"]>[number];
type CompetitionCrew = NonNullable<CompetitionTeam["crews"]>[number];
type CompetitionDriver = NonNullable<CompetitionCrew["drivers"]>[number];
type EventGroup = NonNullable<Competition["eventGroups"]>[number];

interface RankingRowProps {
  rankingItem: RankingItem;
  driver: CompetitionDriver;
  team: NonNullable<Competition["teams"]>[number];
  eventGroups: EventGroup[];
  overallBestTimesPerEventGroup: Record<string, number>;
}

export function RankingTable({ competition, ranking }: RankingTableProps) {
  if (!competition || !ranking || ranking.length === 0) {
    return <div>No ranking available</div>;
  }

  const driversMap: Record<number, CompetitionDriver> = {};
  const driversTeamsMap: Record<number, CompetitionTeam> = {};
  const overallBestTimesPerEventGroup: Record<string, number> = {};

  (competition.teams || []).forEach((team) => {
    (team.crews || []).forEach((crew) => {
      (crew.drivers || []).forEach((driver) => {
        if (!driver.iRacingId) {
          return;
        }

        driversMap[driver.iRacingId] = driver;
        driversTeamsMap[driver.iRacingId] = team;
      });
    });
  });

  ranking.forEach((driverRanking) => {
    Object.entries(driverRanking.results).forEach(([eventGroupId, results]) => {
      Object.values(results).forEach((result) => {
        if (
          result > 0 &&
          (!overallBestTimesPerEventGroup[eventGroupId] ||
            result < overallBestTimesPerEventGroup[eventGroupId])
        ) {
          overallBestTimesPerEventGroup[eventGroupId] = result;
        }
      });
    });
  });

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
          {(competition.eventGroups || []).map((eventGroup, i) => (
            <th
              key={i}
              scope="col"
              className="px-6 py-2"
              colSpan={(eventGroup.sessions || []).length}
            >
              {eventGroup.name}
            </th>
          ))}
        </tr>

        <tr>
          {(competition.eventGroups || []).map((eventGroup) =>
            (eventGroup.sessions || []).map((session, i) => (
              <th key={i} scope="col" className="px-6 py-2">
                {formatDate(session.fromTime)}
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
            driver={driversMap[rankingItem.custId]}
            team={driversTeamsMap[rankingItem.custId]}
            eventGroups={competition.eventGroups || []}
            overallBestTimesPerEventGroup={overallBestTimesPerEventGroup}
          />
        ))}
      </tbody>
    </table>
  );
}

function RankingRow({
  rankingItem,
  driver,
  team,
  eventGroups,
  overallBestTimesPerEventGroup,
}: RankingRowProps) {
  if (!rankingItem) {
    return null;
  }

  return (
    <tr className="border-b border-gray-700 bg-gray-800">
      <td className="px-6 py-4 text-center">P{rankingItem.position}</td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {driver?.firstName} {driver?.lastName}
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
        eventGroups.map((event) => {
          const eventResults = rankingItem.results[event.id || "0"];

          return (event.sessions || []).map((session, i) => {
            const sessionResult = eventResults?.[session.id || "0"] || 0;
            const personalBest = Math.min(
              ...Object.values(eventResults || {}).filter((v) => v > 0)
            );

            return (
              <td key={i} className="px-2 py-1">
                <TimeCard
                  time={sessionResult}
                  isPersonalBest={sessionResult === personalBest}
                  isOverallBest={
                    sessionResult ===
                    overallBestTimesPerEventGroup[event.id || "0"]
                  }
                />
              </td>
            );
          });
        })}
    </tr>
  );
}
