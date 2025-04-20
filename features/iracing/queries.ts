import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/lib/firebase";
import { IRacingSessionDocument } from "./types";
import { extractAverageLapTime } from "./utils";

export async function getIRacingGroupSessions({
  leagueId,
  seasonId,
  trackId,
  fromTime,
  toTime,
  simsessionName,
}: {
  leagueId: number;
  seasonId: number;
  trackId?: number | null;
  fromTime: string;
  toTime: string;
  simsessionName: string;
}): Promise<Record<number, number>> {
  let sessionsQuery = db
    .collection("iracing_sessions")
    .where("launchAt", ">=", Timestamp.fromDate(new Date(fromTime)))
    .where("launchAt", "<=", Timestamp.fromDate(new Date(toTime)))
    .where("leagueId", "==", leagueId)
    .where("seasonId", "==", seasonId);

  if (trackId) {
    sessionsQuery = sessionsQuery.where("trackId", "==", trackId);
  }

  const sessions = await sessionsQuery.get();

  console.log(
    sessions.size,
    "sessions found",
    leagueId,
    seasonId,
    trackId,
    fromTime,
    toTime
  );

  const groupDriverResults: Record<number, number> = {};

  sessions.forEach((s) => {
    const session = s.data() as IRacingSessionDocument;

    for (const simsession of session.simsessions) {
      if (simsession.simsessionName !== simsessionName) {
        continue;
      }

      for (const participant of simsession.participants) {
        // TODO: check if the car is allowed
        // TODO: variable stint length

        const avgLapTime = extractAverageLapTime(participant.laps, 3);
        if (
          avgLapTime &&
          (!groupDriverResults[participant.custId] ||
            groupDriverResults[participant.custId] > avgLapTime)
        ) {
          groupDriverResults[participant.custId] = Math.trunc(avgLapTime);
        }
      }
    }
  });

  return groupDriverResults;
}
