import { Competition } from "@/payload-types"
import { RankingItem } from "../types"
import { TimeCard } from "@/components/ui/time-card"

type CompetitionTeam = NonNullable<Competition["teams"]>[number]
type CompetitionCrew = NonNullable<CompetitionTeam["crews"]>[number]
type CompetitionDriver = NonNullable<CompetitionCrew["drivers"]>[number]
type EventGroup = NonNullable<Competition["eventGroups"]>[number]

export interface RankingRowProps {
  rankingItem: RankingItem
  driver: CompetitionDriver
  team: NonNullable<Competition["teams"]>[number]
  eventGroups: EventGroup[]
  overallBestTimesPerEventGroup: Record<string, number>
}

export function RankingRow({
  rankingItem,
  driver,
  team,
  eventGroups,
  overallBestTimesPerEventGroup,
}: RankingRowProps) {
  if (!rankingItem) {
    return null
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
                  variant={
                    sessionResult === personalBest
                      ? "personalBest"
                      : sessionResult ===
                          overallBestTimesPerEventGroup[event.id || "0"]
                        ? "overallBest"
                        : undefined
                  }
                />
              </td>
            )
          })
        })}
    </tr>
  )
}
