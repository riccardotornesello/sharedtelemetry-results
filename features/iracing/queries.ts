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
  trackId: number;
  fromTime: Timestamp;
  toTime: Timestamp;
  simsessionName: string;
}) {
  const sessions = await db
    .collection("iracing_sessions")
    .where("launchAt", ">=", fromTime)
    .where("launchAt", "<", toTime)
    .where("trackId", "==", trackId)
    .where("leagueId", "==", leagueId)
    .where("seasonId", "==", seasonId)
    .get();

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
