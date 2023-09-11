export default interface Standing {
  id: string,
  name: string,
  position: number,
  score: number,
  played_matches: number,
  won_matches: number,
  drawn_matches: number,
  lost_matches: number,
  value: number,
  value_against: number,
  value_difference: number,
}