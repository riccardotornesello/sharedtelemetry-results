"use server"

import { getCompetitionBySlug } from "../competitions/queries"
import { Competition } from "@/payload-types"
import { RankingItem } from "./types"
import dayjs from "dayjs"
import { stringify } from "csv-stringify/sync"
import { formatMilliseconds } from "@/lib/format"
import dbConnect from "@/lib/mongodb"

// TODO: move to config
const RESULTS_DB_NAME = "results-operator"
const COMPETITIONS_COLLECTION_NAME = "competitions"
const SCRAPER_DB_NAME = "iracing-scraper"
const SEASONS_COLLECTION_NAME = "seasons"

interface ISeasonData {
  meta: {
    kind: string
    name: string
  }
  status: {
    parsed_sessions: Record<string, { track_id: number; launch_at: string }>
  }
}

interface ICompetitionData {
  competition_id: number
  results: {
    driver_id: number
    subsession_id: number
    average_lap_time_ms: number
    laps: {
      lap_number: number
      flags: number
      incident: boolean
      session_time: number
      lap_time: number
      lap_events: string[]
    }[]
  }[]
}

export async function getCompetitionRanking(slug: string) {
  // Get the competition
  const competition = await getCompetitionBySlug(slug)
  if (!competition) {
    return null
  }

  // Get the sessions list and results from MongoDB
  const mongoClient = await dbConnect()
  const resultsDb = mongoClient.db(RESULTS_DB_NAME)
  const competitionsCollection = resultsDb.collection<ICompetitionData>(
    COMPETITIONS_COLLECTION_NAME
  )
  const competitionData = await competitionsCollection.findOne({
    competition_id: 12345,
  })

  const scraperDb = mongoClient.db(SCRAPER_DB_NAME)
  const seasonsCollection = scraperDb.collection<ISeasonData>(
    SEASONS_COLLECTION_NAME
  )
  const seasonData = await seasonsCollection.findOne({
    "meta.kind": "iracing_league_season",
    "meta.name": `league_${competition.leagueId}_season_${competition.seasonId}`,
  })

  if (!competitionData || !seasonData) {
    return null
  }

  // Get the list of allowed drivers
  // TODO: validate cars
  const driverIds: number[] = (competition.teams || [])
    .map((team) =>
      (team.crews || []).map((crew) =>
        (crew.drivers || []).map((driver) => driver.iRacingId)
      )
    )
    .flat(3)
    .filter((v) => v !== undefined && v !== null)

  // Map session IDs to event group and session IDs
  const sessionGroups = Object.entries(
    seasonData.status.parsed_sessions
  ).reduce(
    (acc, [id, session]) => {
      const { eventGroupId, eventSessionId } = getSessionEventGroupId(
        session,
        competition.eventGroups || []
      )

      if (!eventGroupId || !eventSessionId) {
        return acc
      }

      acc[id] = { eventGroupId, eventSessionId }

      return acc
    },
    {} as Record<string, { eventGroupId: string; eventSessionId: string }>
  )

  // Group best results by driver and event session
  const bestResults = competitionData.results.reduce(
    (acc, result) => {
      const resultDriverId = result.driver_id

      // Skip if the driver is not in the competition
      if (!driverIds.includes(resultDriverId)) {
        return acc
      }

      // Skip if the time is not valid
      if (!result.average_lap_time_ms || result.average_lap_time_ms <= 0) {
        return acc
      }

      const { eventGroupId, eventSessionId } = sessionGroups[
        result.subsession_id
      ] || { eventGroupId: null, eventSessionId: null }

      // Skip if the session is not part of the competition
      if (!eventGroupId || !eventSessionId) {
        return acc
      }

      if (!acc[resultDriverId]) {
        acc[resultDriverId] = {}
      }

      if (!acc[resultDriverId][eventGroupId]) {
        acc[resultDriverId][eventGroupId] = {}
      }

      if (
        !acc[resultDriverId][eventGroupId][eventSessionId] ||
        acc[resultDriverId][eventGroupId][eventSessionId] >
          result.average_lap_time_ms
      ) {
        acc[resultDriverId][eventGroupId][eventSessionId] =
          result.average_lap_time_ms
      }

      return acc
    },
    {} as Record<number, Record<string, Record<string, number>>>
  )

  const driversRanking: RankingItem[] = []
  for (const custId of driverIds) {
    let totalMs = 0
    let isValid = true

    if (custId === 393525) {
      console.log("Best Results for 393525:", bestResults[custId])
    }

    ;(competition.eventGroups || []).forEach((eventGroup) => {
      const eventGroupResults: Record<number, number> =
        (eventGroup.id && bestResults[custId]?.[eventGroup.id]) || {}

      if (Object.keys(eventGroupResults).length === 0) {
        isValid = false
      } else {
        const bestGroupResult = Math.min(...Object.values(eventGroupResults))
        totalMs += bestGroupResult
      }
    })

    driversRanking.push({
      position: 0,
      custId: custId,
      sum: totalMs,
      isValid,
      results: bestResults[custId] || {},
    })
  }

  // Sort the driversRanking. Primary sort by isValid, secondary by sum
  driversRanking.sort((a, b) => {
    if (a.isValid && !b.isValid) {
      return -1
    }
    if (!a.isValid && b.isValid) {
      return 1
    }
    if (a.sum === 0) {
      return 1
    }
    if (b.sum === 0) {
      return -1
    }
    return a.sum - b.sum
  })

  // Add the position to the driversRanking
  driversRanking.forEach((item, index) => {
    item.position = index + 1
  })

  return { driversRanking, competition }
}

function getSessionEventGroupId(
  session: any,
  eventGroups: Competition["eventGroups"]
): { eventGroupId: string | null; eventSessionId: string | null } {
  if (!session || !eventGroups) {
    return { eventGroupId: null, eventSessionId: null }
  }

  for (const eventGroup of eventGroups) {
    if (!eventGroup.sessions) {
      continue
    }

    for (const eventSession of eventGroup.sessions) {
      if (
        session.track_id === eventGroup.iRacingTrackId &&
        !dayjs(session.launch_at).isBefore(eventSession.fromTime) &&
        !dayjs(session.launch_at).isAfter(eventSession.toTime)
      ) {
        return {
          eventGroupId: eventGroup.id || null,
          eventSessionId: eventSession.id || null,
        }
      }
    }
  }

  return { eventGroupId: null, eventSessionId: null }
}

export async function getCompetitionSessionsCsv(slug: string) {
  // Get the competition
  const competition = await getCompetitionBySlug(slug)
  if (!competition) {
    return null
  }

  // Get the sessions list and results from MongoDB
  const mongoClient = await dbConnect()
  const resultsDb = mongoClient.db(RESULTS_DB_NAME)
  const competitionsCollection = resultsDb.collection<ICompetitionData>(
    COMPETITIONS_COLLECTION_NAME
  )
  const competitionData = await competitionsCollection.findOne({
    competition_id: 12345,
  })

  const scraperDb = mongoClient.db(SCRAPER_DB_NAME)
  const seasonsCollection = scraperDb.collection<ISeasonData>(
    SEASONS_COLLECTION_NAME
  )
  const seasonData = await seasonsCollection.findOne({
    "meta.kind": "iracing_league_season",
    "meta.name": `league_${competition.leagueId}_season_${competition.seasonId}`,
  })

  if (!competitionData || !seasonData) {
    return null
  }

  // Get the list of allowed drivers
  // TODO: validate cars
  const drivers = (competition.teams || [])
    .map((team) =>
      (team.crews || []).map((crew) =>
        (crew.drivers || []).map((driver) => driver)
      )
    )
    .flat(3)
    .filter((v) => v !== undefined && v !== null)
  const driverIds = drivers.map((driver) => driver.iRacingId)

  // Get the valid sessions sorted by date
  const sortedSessionIds = Object.entries(seasonData.status.parsed_sessions)
    .filter(([id, session]) => {
      const { eventGroupId, eventSessionId } = getSessionEventGroupId(
        session,
        competition.eventGroups || []
      )

      return !!eventGroupId && !!eventSessionId
    })
    .toSorted(([idA, sessionA], [idB, sessionB]) => {
      const dateA = dayjs(sessionA.launch_at)
      const dateB = dayjs(sessionB.launch_at)

      if (dateA.isBefore(dateB)) {
        return -1
      }
      return 1
    })
    .map(([id, session]) => id)

  // Group session results by driver and session
  const groupedResults: Record<
    number,
    Record<number, number>
  > = competitionData.results.reduce(
    (acc, result) => {
      const resultDriverId = result.driver_id
      const resultSessionId = result.subsession_id

      if (!acc[resultDriverId]) {
        acc[resultDriverId] = {}
      }

      acc[resultDriverId][resultSessionId] = result.average_lap_time_ms

      return acc
    },
    {} as Record<number, Record<number, number>>
  )

  // Generate the output table
  const header = [
    "Driver",
    "Id",
    ...sortedSessionIds.map((id) =>
      dayjs(seasonData.status.parsed_sessions[id].launch_at).format(
        "YYYY-MM-DD HH:mm"
      )
    ),
  ]
  const rows = drivers.map((driver) => {
    const row: string[] = [
      driver.firstName + " " + driver.lastName,
      driver.iRacingId.toString(),
    ]

    sortedSessionIds.forEach((sessionId) => {
      const lapTime = groupedResults[driver.iRacingId]?.[parseInt(sessionId)]
      if (lapTime === null || lapTime === undefined) {
        row.push("")
      } else if (lapTime <= 0) {
        row.push(formatMilliseconds(lapTime))
      } else {
        row.push(formatMilliseconds(lapTime))
      }
    })

    return row
  })

  const output = [header, ...rows]
  const csv = stringify(output, { delimiter: ";" })
  return csv
}
