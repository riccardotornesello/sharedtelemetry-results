import { TimeCard } from "@/components/time-card";
import { CompetitionDriver } from "@/features/drivers/types";
import { CompetitionTeam } from "@/features/teams/types";

// TODO: types
export interface RankingRowProps {
  rankingItem: any;
  driver: CompetitionDriver;
  team: CompetitionTeam;
}

export function RankingRow({ rankingItem, driver, team }: RankingRowProps) {
  return (
    <tr className="border-b border-gray-700 bg-gray-800">
      <td className="px-6 py-4 text-center">P{rankingItem.position}</td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {driver.firstName}
          {driver.lastName}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex flex-row">
            {team.pictureUrl && (
              <img
                src={team.pictureUrl}
                alt={team.name}
                className="mr-4 h-6 w-6 object-cover"
              />
            )}
            <span>{team.name}</span>
          </div>
        </div>
      </td>

      <td className="px-2 py-1">
        <TimeCard time={rankingItem.sum} />
      </td>
    </tr>
  );
}
