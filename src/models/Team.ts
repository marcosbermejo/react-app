import Club from "./Club";

export default interface Team {
  id: string;
  name: string;
  image: string;
  club?: Club;
}