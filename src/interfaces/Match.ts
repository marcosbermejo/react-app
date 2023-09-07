import Team from "./Team";

export default interface Match {
  id: string;
  finished: boolean;
  date?: Date;
  homeTeam?: Team;
  awayTeam?: Team;
  facility: string;
}