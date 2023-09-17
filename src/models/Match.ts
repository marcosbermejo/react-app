import Period from "./Period";
import Round from "./Round";
import Team from "./Team";

export default interface Match {
  id: string;
  tournamentId: string;
  finished: boolean;
  postponed: boolean;
  canceled: boolean;
  facility?: string;
  date?: Date;
  homeTeam?: Team;
  awayTeam?: Team;
  homeTeamResult?: number;
  awayTeamResult?: number;
  round?: Round;
  periods: Period[];
  faceoffId?: string;
}