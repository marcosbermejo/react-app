import Group from "./Group";
import Match from "./Match";

export default interface Tournament {
  id: string;
  name: string;
  groups: Group[];
  order: number;
  status: string;
  nextMatch: Match | null
}