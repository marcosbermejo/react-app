export default interface Scoring {
  id: string;
  team?: 'first' | 'second';
  result?: string;
  minute?: string;
  number?: string;
  player?: string;
  text?: string;
}