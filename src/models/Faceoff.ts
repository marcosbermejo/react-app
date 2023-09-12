import Team from "./Team"

export default interface Faceoff {
  id: string
  firstText: string
  secondText: string
  winner: string
  firstTeam?: Team
  secondTeam?: Team
  firstPreviousFaceoffId?: string,
  secondPreviousFaceoffId?: string,
}