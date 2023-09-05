import Team from "./Team";

export default interface Round {
  id: string;
  finished: boolean;
  date: Date | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
}