import { Competition } from "@/payload-types"
import { RankingItem } from "../types"
import { formatDate } from "@/lib/format"
import { RankingRow } from "./ranking-row"

export interface RankingTableProps {
  competition: Competition
  ranking: RankingItem[]
}

type CompetitionTeam = NonNullable<Competition["teams"]>[number]
type CompetitionCrew = NonNullable<CompetitionTeam["crews"]>[number]
type CompetitionDriver = NonNullable<CompetitionCrew["drivers"]>[number]

export function RankingTable({ competition, ranking }: RankingTableProps) {
  if (!competition || !ranking || ranking.length === 0) {
    return <div>No ranking available</div>
  }

  const driversMap: Record<number, CompetitionDriver> = {}
  const driversTeamsMap: Record<number, CompetitionTeam> = {}
  const overallBestTimesPerEventGroup: Record<string, number> = {}

  ;(competition.teams || []).forEach((team) => {
    ;(team.crews || []).forEach((crew) => {
      ;(crew.drivers || []).forEach((driver) => {
        if (!driver.iRacingId) {
          return
        }

        driversMap[driver.iRacingId] = driver
        driversTeamsMap[driver.iRacingId] = team
      })
    })
  })

  ranking.forEach((driverRanking) => {
    Object.entries(driverRanking.results).forEach(([eventGroupId, results]) => {
      Object.values(results).forEach((result) => {
        if (
          result > 0 &&
          (!overallBestTimesPerEventGroup[eventGroupId] ||
            result < overallBestTimesPerEventGroup[eventGroupId])
        ) {
          overallBestTimesPerEventGroup[eventGroupId] = result
        }
      })
    })
  })

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
  )
}
