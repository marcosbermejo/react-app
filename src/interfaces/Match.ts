import Round from "./Round";
import Team from "./Team";

export default interface Match {
  id: string;
  finished: boolean;
  facility?: string;
  date?: Date;
  homeTeam?: Team;
  awayTeam?: Team;
  round?: Round;
}