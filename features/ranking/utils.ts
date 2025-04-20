"use server";

import { getCompetitionBySlug } from "../competitions/queries";
import { Competition } from "@/payload-types";
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
): Promise<Record<number, Record<string, Record<string, number>>>> {
  const bestResults: Record<
    number,
    Record<string, Record<string, number>>
  > = {}; //  Customer ID, Group ID, Group Session ID, average ms

  if (!competition.eventGroups) {
    return bestResults;
  }

  for (const eventGroup of competition.eventGroups) {
    if (!eventGroup.sessions) {
      continue;
    }

    if (!eventGroup.id) {
      continue;
    }

    for (const eventSession of eventGroup.sessions) {
      const sessionResults = await getIRacingGroupSessions({
        leagueId: competition.leagueId,
        seasonId: competition.seasonId,
        trackId: eventGroup.iRacingTrackId,
        fromTime: eventSession.fromTime,
        toTime: eventSession.toTime,
        simsessionName: "QUALIFY", // TODO: variable
      });

      for (const custId in sessionResults) {
        if (!bestResults[custId]) {
          bestResults[custId] = {};
        }

        if (!bestResults[custId][eventGroup.id]) {
          bestResults[custId][eventGroup.id] = {};
        }

        if (!eventSession.id) {
          continue;
        }

        bestResults[custId][eventGroup.id][eventSession.id] =
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

  const driverIds = (competition.teams || [])
    .map((team) =>
      (team.crews || []).map((crew) =>
        (crew.drivers || []).map((driver) => driver.iRacingId)
      )
    )
    .flat(3)
    .filter((v) => v !== undefined && v !== null);

  const driversRanking: RankingItem[] = [];

  for (const custId of driverIds) {
    let totalMs = 0;
    let isValid = true;

    (competition.eventGroups || []).forEach((eventGroup) => {
      const eventGroupResults: Record<string, number> | undefined =
        bestResults[custId]?.[eventGroup.id || "0"];

      if (!eventGroupResults) {
        isValid = false;
      } else {
        const bestGroupResult = Math.min(
          ...Object.values(eventGroupResults || {})
        );
        totalMs += bestGroupResult;
      }
    });

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
