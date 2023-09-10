import Match from "./Match";

export default interface Tournament {
  id: string;
  name: string;
  order: number;
  status: string;
  category: string;
  matches: Match[];
}