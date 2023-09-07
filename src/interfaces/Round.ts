import Match from "./Match";

export default interface Round {
  id: string;
  name: string;
  start_date?: Date;
  end_date?: Date;
  matches: Match[];
}