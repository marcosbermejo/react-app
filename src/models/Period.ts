export default interface Period {
  id: string;
  name: string;
  finished: boolean;
  order: number;
  homeTeamResult: number;
  awayTeamResult: number;
}