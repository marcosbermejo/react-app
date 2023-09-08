import Round from "./Round";

export default interface Group {
  id: string;
  name: string;
  type: string;
  group: string;
  promote: number;
  relegate: number;
  rounds: Round[];
}