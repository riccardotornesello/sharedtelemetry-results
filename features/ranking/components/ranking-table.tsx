import { Competition } from "@/payload-types"
import { RankingItem } from "../types"
import { formatDate } from "@/lib/format"
import { TimeCard } from "@/components/time-card"
import { Fragment } from "react"

/**
 * Props for the RankingTable component
 */
export interface RankingTableProps {
  /** Competition metadata including event groups and sessions */
  competition: Competition
  /** Array of driver rankings with their best times */
  ranking: RankingItem[]
}

type CompetitionTeam = NonNullable<Competition["teams"]>[number]
type CompetitionCrew = NonNullable<CompetitionTeam["crews"]>[number]
type CompetitionDriver = NonNullable<CompetitionCrew["drivers"]>[number]
type EventGroup = NonNullable<Competition["eventGroups"]>[number]

/**
 * Props for the RankingRow component
 */
interface RankingRowProps {
  rankingItem: RankingItem
  driver: CompetitionDriver
  team: NonNullable<Competition["teams"]>[number]
  eventGroups: EventGroup[]
  overallBestTimesPerEventGroup: Record<string, number>
  position: number
}

/**
 * RankingTable component displays a comprehensive table of competition results.
 *
 * The table shows:
 * - Driver position and information
 * - Team affiliation
 * - Total time (sum of best times across all event groups)
 * - Individual lap times for each session, with visual indicators for:
 *   - Overall best times (purple)
 *   - Personal best times (green)
 *
 * For multi-class competitions, results are grouped by class with separate rankings.
 *
 * @example
 * ```tsx
 * <RankingTable
 *   competition={competitionData}
 *   ranking={driverRankings}
 * />
 * ```
 */
export function RankingTable({ competition, ranking }: RankingTableProps) {
  if (!competition || !ranking || ranking.length === 0) {
    return <div>No ranking available</div>
  }

  const driversMap: Record<number, CompetitionDriver> = {}
  const driversCrewsMap: Record<number, CompetitionCrew> = {}
  const driversTeamsMap: Record<number, CompetitionTeam> = {}

  ;(competition.teams || []).forEach((team) => {
    ;(team.crews || []).forEach((crew) => {
      ;(crew.drivers || []).forEach((driver) => {
        if (!driver.iRacingId) {
          return
        }

        driversMap[driver.iRacingId] = driver
        driversCrewsMap[driver.iRacingId] = crew
        driversTeamsMap[driver.iRacingId] = team
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
        <TableBody
          ranking={ranking}
          driversMap={driversMap}
          driversCrewsMap={driversCrewsMap}
          driversTeamsMap={driversTeamsMap}
          competition={competition}
        />
      </tbody>
    </table>
  )
}

/**
 * TableBody component handles rendering of table rows.
 *
 * For multi-class competitions, it groups drivers by class and calculates
 * separate best times per class. For single-class competitions, it shows
 * a simple list of all drivers with overall best times.
 */
function TableBody({
  ranking,
  driversMap,
  driversCrewsMap,
  driversTeamsMap,
  competition,
}: {
  ranking: RankingItem[]
  driversMap: Record<number, CompetitionDriver>
  driversCrewsMap: Record<number, CompetitionCrew>
  driversTeamsMap: Record<number, CompetitionTeam>
  competition: Competition
}) {
  const classes = competition?.classes || []

  // Multiclass
  if (classes.length > 1) {
    // class / event group / best time
    const overallBestTimesPerEventGroup: Record<
      string,
      Record<string, number>
    > = {}

    classes.forEach((c) => {
      overallBestTimesPerEventGroup[c.name] = {}
    })

    ranking.forEach((driverRanking) => {
      Object.entries(driverRanking.results).forEach(
        ([eventGroupId, results]) => {
          Object.values(results).forEach((result) => {
            const crew = driversCrewsMap[driverRanking.custId]
            const crewClass = crew?.class || "-"

            if (
              result > 0 &&
              (!overallBestTimesPerEventGroup[crewClass][eventGroupId] ||
                result < overallBestTimesPerEventGroup[crewClass][eventGroupId])
            ) {
              overallBestTimesPerEventGroup[crewClass][eventGroupId] = result
            }
          })
        }
      )
    })

    const rankingPerClass: Record<string, RankingItem[]> = classes.reduce(
      (acc, c) => {
        acc[c.name] = ranking.filter((r) => {
          const crew = driversCrewsMap[r.custId]
          return (crew?.class || "-") === c.name
        })
        return acc
      },
      {} as Record<string, RankingItem[]>
    )

    return classes.map((c, i) => (
      <Fragment key={i}>
        <ClassHead className={c.name} competition={competition} />

        {rankingPerClass[c.name].map((rankingItem, i) => (
          <RankingRow
            key={i}
            rankingItem={rankingItem}
            driver={driversMap[rankingItem.custId]}
            team={driversTeamsMap[rankingItem.custId]}
            eventGroups={competition.eventGroups || []}
            overallBestTimesPerEventGroup={
              overallBestTimesPerEventGroup[c.name]
            }
            position={i + 1}
          />
        ))}
      </Fragment>
    ))
  }

  // Single class
  else {
    const overallBestTimesPerEventGroup: Record<string, number> = {}

    ranking.forEach((driverRanking) => {
      Object.entries(driverRanking.results).forEach(
        ([eventGroupId, results]) => {
          Object.values(results).forEach((result) => {
            if (
              result > 0 &&
              (!overallBestTimesPerEventGroup[eventGroupId] ||
                result < overallBestTimesPerEventGroup[eventGroupId])
            ) {
              overallBestTimesPerEventGroup[eventGroupId] = result
            }
          })
        }
      )
    })

    return ranking.map((rankingItem, i) => (
      <RankingRow
        key={i}
        rankingItem={rankingItem}
        driver={driversMap[rankingItem.custId]}
        team={driversTeamsMap[rankingItem.custId]}
        eventGroups={competition.eventGroups || []}
        overallBestTimesPerEventGroup={overallBestTimesPerEventGroup}
        position={i + 1}
      />
    ))
  }
}

/**
 * ClassHead component renders a header row for a specific class in multi-class competitions.
 */
function ClassHead({
  className,
  competition,
}: {
  className: string
  competition: Competition
}) {
  return (
    <tr>
      <td
        colSpan={
          4 +
          (competition.eventGroups?.reduce(
            (acc, eg) => acc + (eg.sessions?.length || 0),
            0
          ) || 0)
        }
        className="text-center font-bold bg-gray-900 text-gray-300 py-2 text-xl"
      >
        {className}
      </td>
    </tr>
  )
}

/**
 * RankingRow component renders a single driver's results row.
 *
 * The row includes:
 * - Position number
 * - Driver name
 * - Team name and logo
 * - Total time
 * - Individual session times with color coding for best times
 */
function RankingRow({
  rankingItem,
  driver,
  team,
  eventGroups,
  overallBestTimesPerEventGroup,
  position,
}: RankingRowProps) {
  if (!rankingItem) {
    return null
  }

  return (
    <tr className="border-b border-gray-700 bg-gray-800">
      <td className="px-6 py-4 text-center">P{position}</td>

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
          const eventResults = rankingItem.results[event.id || "0"]

          return (event.sessions || []).map((session, i) => {
            const sessionResult = eventResults?.[session.id || "0"] || 0
            const personalBest = Math.min(
              ...Object.values(eventResults || {}).filter((v) => v > 0)
            )

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
            )
          })
        })}
    </tr>
  )
}
