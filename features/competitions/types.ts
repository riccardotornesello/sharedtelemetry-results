import { CompetitionTeam } from "../teams/types";

export interface Competition {
  leagueId: number;
  seasonId: number;
  name: string;
  slug: string;
  crewDriversCount: number;
  classes: Record<string, CompetitionClass[]>;
  teams: CompetitionTeam[];
  eventGroups: EventGroup[];
}

export interface CompetitionClass {
  name: string;
  color: string;
}

export interface EventGroup {
  name: string;
  sessions: EventSession[];

  iRacingTrackId?: number | null;
}

export interface EventSession {
  fromTime: string;
  toTime: string;
}
