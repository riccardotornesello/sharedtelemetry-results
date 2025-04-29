"use server";

import { getCompetitionBySlug } from "../competitions/queries";
import { Competition } from "@/payload-types";
import {
  getIRacingBestGroupSessions,
  getIRacingGroupSessions,
} from "../iracing/queries";
import { RankingItem } from "./types";
import { getCache, setCache } from "@/lib/redis";
import dayjs from "dayjs";
import { IRacingSessionDocument } from "../iracing/types";
import { extractAverageLapTime } from "../iracing/utils";
import { stringify } from "csv-stringify/sync";
import { formatMilliseconds } from "@/lib/format";

export async function getCompetitionRanking(slug: string) {
  const cacheKey = `competitionRanking:${slug}`;
  const cache = await getCache(cacheKey);
  if (cache) {
    const parsedCache = JSON.parse(cache);
    return parsedCache;
  }

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

  const output = { driversRanking, competition };

  // Cache the output
  const cacheExpiration = 10 * 60; // 10 minutes
  await setCache(cacheKey, JSON.stringify(output), cacheExpiration);

  return output;
}

/**
 * Get the best result for each driver in each event group of a specific competition.
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

  const queryResults = competition.eventGroups.reduce(
    (acc, eventGroup) => {
      if (!eventGroup.sessions || !eventGroup.id) {
        return acc;
      }

      const eventGroupSessionQueries = eventGroup.sessions.reduce(
        (acc, eventSession) => {
          if (!eventSession.id) {
            return acc;
          }

          const query = getIRacingBestGroupSessions({
            leagueId: competition.leagueId,
            seasonId: competition.seasonId,
            trackId: eventGroup.iRacingTrackId,
            fromTime: eventSession.fromTime,
            toTime: eventSession.toTime,
            simsessionName: "QUALIFY", // TODO: variable
          });

          return {
            ...acc,
            [eventSession.id]: query,
          };
        },
        {} as Record<string, Promise<Record<number, number>>>
      );

      return {
        ...acc,
        [eventGroup.id]: eventGroupSessionQueries,
      };
    },
    {} as Record<string, Record<string, Promise<Record<number, number>>>>
  );

  for (const eventGroup of competition.eventGroups) {
    if (!eventGroup.sessions || !eventGroup.id) {
      continue;
    }

    for (const eventSession of eventGroup.sessions) {
      if (!eventSession.id) {
        continue;
      }

      const sessionResults =
        await queryResults[eventGroup.id]?.[eventSession.id];

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

export async function getCompetitionSessionsCsv(slug: string) {
  const competition = await getCompetitionBySlug(slug);

  if (!competition || !competition.eventGroups) {
    return null;
  }

  const drivers = (competition.teams || [])
    .map((team) =>
      (team.crews || []).map((crew) =>
        (crew.drivers || []).map((driver) => driver)
      )
    )
    .flat(3)
    .filter((v) => v !== undefined && v !== null);
  const driverIds = drivers.map((driver) => driver.iRacingId);

  const driverResults: Record<
    number,
    Record<string, number | null>
  > = drivers.reduce(
    (acc, driver) => {
      acc[driver.iRacingId] = {};
      return acc;
    },
    {} as Record<number, Record<string, number>>
  );
  const sessionDates: string[] = [];

  for (const eventGroup of competition.eventGroups) {
    if (!eventGroup.id || !eventGroup.sessions) {
      continue;
    }

    for (const eventSession of eventGroup.sessions) {
      const iRacingSessions = await getIRacingGroupSessions({
        leagueId: competition.leagueId,
        seasonId: competition.seasonId,
        trackId: eventGroup.iRacingTrackId,
        fromTime: eventSession.fromTime,
        toTime: eventSession.toTime,
      });

      iRacingSessions.forEach((s) => {
        const iRacingSession = s.data() as IRacingSessionDocument;

        iRacingSession.simsessions.forEach((simsession) => {
          if (simsession.simsessionName !== "QUALIFY") {
            return;
          }

          const formattedLaunchAt = dayjs(
            iRacingSession.launchAt.toDate()
          ).format("YYYY-MM-DD HH:mm:ss");

          sessionDates.push(formattedLaunchAt);

          simsession.participants.forEach((participant) => {
            if (!driverIds.includes(participant.custId)) {
              return;
            }

            const avgLapTime = extractAverageLapTime(participant.laps, 3);
            driverResults[participant.custId][formattedLaunchAt] = avgLapTime;
          });
        });
      });
    }
  }

  // Sort sessionDates in descending order
  sessionDates.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const output: Record<string, string>[] = [];
  drivers.forEach((driver) => {
    const row: Record<string, string> = {
      Driver: driver.firstName + " " + driver.lastName,
      Id: driver.iRacingId.toString(),
    };

    sessionDates.forEach((date) => {
      const lapTime = driverResults[driver.iRacingId][date];
      if (lapTime === undefined) {
        row[date] = "";
      } else if (lapTime === null) {
        row[date] = formatMilliseconds(0);
      } else {
        row[date] = formatMilliseconds(lapTime);
      }
    });

    output.push(row);
  });

  const csv = stringify(output, { header: true, delimiter: ";" });
  return csv;
}
