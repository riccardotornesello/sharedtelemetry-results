import { Timestamp } from "firebase-admin/firestore";

export interface Competition {
  id: string;

  leagueId: number;
  seasonId: number;

  name: string;
  slug: string;

  crewDriversCount: number;

  createdAt: string;
  updatedAt: string;

  classes: Record<string, CompetitionClass[]>;
  teams: CompetitionTeam[];
  eventGroups: EventGroup[];
}

export interface CompetitionClass {
  name: string;
  color: string;
}

export interface CompetitionTeam {
  name: string;
  pictureUrl?: string | null;

  crews: CompetitionCrew[];
}

export interface CompetitionCrew {
  name: string;
  drivers: CompetitionDriver[];

  class?: string | null;

  iRacingCarId?: number | null;
}

export interface CompetitionDriver {
  firstName: string;
  lastName: string;

  iRacingId?: number | null;
}

export interface EventGroup {
  name: string;
  sessions: EventSession[];

  iRacingTrackId?: number | null;
}

export interface EventSession {
  fromTime: Timestamp;
  toTime: Timestamp;
}
