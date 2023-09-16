import Period from "./Period";
import Profile from "./Profile";
import Round from "./Round";
import Scoring from "./Scoring";
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
  scoring: Scoring[],
  referees: Profile[]
}