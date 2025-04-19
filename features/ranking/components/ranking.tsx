import { CompetitionDriver } from "@/features/drivers/types";
import { RankingRow } from "./ranking-row";

// TODO: types
export interface RankingProps {
  ranking: any;
  drivers: CompetitionDriver[];
  events: any;
  driversCrewMap: any;
  driversTeamMap: any;
  overallBest: any;
}

export function Ranking({
  ranking,
  drivers,
  events,
  driversCrewMap,
  driversTeamMap,
  overallBest,
}: RankingProps) {
  return (
    <>
      {ranking.map((rankingItem) => (
        <RankingRow
          rankingItem={rankingItem}
          driver={drivers[rankingItem.custId]}
          events={events}
          crew={driversCrewMap[rankingItem.custId]}
          team={driversTeamMap[rankingItem.custId]}
          overallBest={overallBest}
        />
      ))}
    </>
  );
}
