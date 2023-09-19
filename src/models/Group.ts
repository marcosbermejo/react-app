import Round from "./Round";
import Standing from "./Standing";

export default interface Group {
  id: string;
  name: string;
  type?: string;
  group?: string;
  promote?: number;
  relegate?: number;
  standings: Standing[];
  rounds: Round[];
}