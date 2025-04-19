import { CompetitionDriver } from "../drivers/types";

export interface CompetitionCrew {
  name: string;
  drivers: CompetitionDriver[];

  class?: string | null;

  iRacingCarId?: number | null;
}
