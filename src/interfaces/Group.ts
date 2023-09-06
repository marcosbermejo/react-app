import Round from "./Round";

export default interface Group {
  id: string;
  name: string;
  rounds: Round[];
}