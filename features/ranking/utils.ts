"use server";

import { getCompetitionBySlug } from "../competitions/queries";
import { Competition } from "../competitions/types";
import { getIRacingGroupSessions } from "../iracing/queries";
import dayjs from "dayjs";
import { RankingItem } from "./types";

/**
 * Get the best result for each driver in each event group of a specific competition.
 * @param competition
 * @returns
 */
export async function getCompetitionBestResults(
  competition: Competition
): Promise<Record<number, Record<number, Record<string, number>>>> {
  const bestResults: Record<
    number,
    Record<number, Record<string, number>>
  > = {}; //  Customer ID, Group, Date, average ms

  for (
    let eventGroupIndex = 0;
    eventGroupIndex < competition.eventGroups.length;
    eventGroupIndex++
  ) {
    const eventGroup = competition.eventGroups[eventGroupIndex];

    for (const eventSession of eventGroup.sessions) {
      const sessionResults = await getIRacingGroupSessions({
        leagueId: competition.leagueId,
        seasonId: competition.seasonId,
        trackId: eventGroup.iRacingTrackId || -1,
        fromTime: eventSession.fromTime,
        toTime: eventSession.toTime,
        simsessionName: "QUALIFY",
      });

      for (const custId in sessionResults) {
        if (!bestResults[custId]) {
          bestResults[custId] = {};
        }

        if (!bestResults[custId][eventGroupIndex]) {
          bestResults[custId][eventGroupIndex] = {};
        }

        const dateString = dayjs(eventSession.fromTime.toMillis()).format(
          "YYYY-MM-DD"
        );

        bestResults[custId][eventGroupIndex][dateString] =
          sessionResults[custId];
      }
    }
  }

  return bestResults;
}

export async function getCompetitionRanking(slug: string) {
  const competition = await getCompetitionBySlug(slug);
  if (!competition) {
    return null;
  }

  const bestResults = await getCompetitionBestResults(competition);

  const driverIds = competition.teams
    .map((team) =>
      team.crews.map((crew) => crew.drivers.map((driver) => driver.iRacingId))
    )
    .flat(3)
    .filter((v) => v !== undefined && v !== null);

  const driversRanking: RankingItem[] = [];

  for (const custId of driverIds) {
    let totalMs = 0;
    let isValid = true;

    for (
      let eventGroupIndex = 0;
      eventGroupIndex < competition.eventGroups.length;
      eventGroupIndex++
    ) {
      const eventGroupResults: Record<string, number> | undefined =
        bestResults[custId]?.[eventGroupIndex];
      if (!eventGroupResults) {
        isValid = false;
      } else {
        const bestGroupResult = Math.min(
          ...Object.values(eventGroupResults || {})
        );
        totalMs += bestGroupResult;
      }
    }

    driversRanking.push({
      position: 0,
      custId: custId,
      sum: totalMs,
      isValid,
      results: bestResults[custId] || {},
    });
  }

  // Sort the driversRanking. Primary sort by isValid, secondary by sum
  driversRanking.sort((a, b) => {
    if (a.isValid && !b.isValid) {
      return -1;
    }
    if (!a.isValid && b.isValid) {
      return 1;
    }
    if (a.sum === 0) {
      return 1;
    }
    if (b.sum === 0) {
      return -1;
    }
    return a.sum - b.sum;
  });

  // Add the position to the driversRanking
  driversRanking.forEach((item, index) => {
    item.position = index + 1;
  });

  return { driversRanking, competition };
}
