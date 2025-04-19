import { CompetitionCrew } from "../crews/types";

export interface CompetitionTeam {
  name: string;
  pictureUrl?: string | null;

  crews: CompetitionCrew[];
}
