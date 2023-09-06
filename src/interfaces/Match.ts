import Team from "./Team";

export default interface Match {
  id: string;
  finished: boolean;
  date: Date | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
}