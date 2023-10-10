import Period from "./Period";
import Profile from "./Profile";
import Round from "./Round";
import Team from "./Team";
import Tournament from "./Tournament";

export default interface Match {
  id: string;
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
  referees: Profile[];
  faceoffId?: string;
  tournament: Tournament;
}