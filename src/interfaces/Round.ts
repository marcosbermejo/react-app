import Match from "./Match";

export default interface Round {
  id: string;
  name: string;
  start_date: Date | null;
  end_date: Date | null;
  matches: Match[];
}