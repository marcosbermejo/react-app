import Team from "./Team"

export default interface Faceoff {
  id: string
  first_text: string
  second_text: string
  winner: string
  first_team?: Team
  second_team?: Team
}