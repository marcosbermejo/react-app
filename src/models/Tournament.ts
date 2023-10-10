import Team from "./Team";

export default interface Tournament {
  id: string;
  name: string;
  order: number;
  status: string;
  category: string;
  teams: Team[];
  start?: Date;
  end?: Date;
}