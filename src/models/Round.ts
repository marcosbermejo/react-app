import Faceoff from "./Faceoff";

export default interface Round {
  id: string;
  name: string;
  order: number;
  start_date?: Date;
  end_date?: Date;
  groupId: string;
  faceoffs: Faceoff[]
}