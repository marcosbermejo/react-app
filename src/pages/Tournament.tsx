import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"

import { HeaderContext } from "../state/Header/context"
import { TournamentsContext } from "../state/Tournaments/context"
import Detail from "../components/Tournament/Detail/Detail"

export default function Tournament() {
  const { tournamentId } = useParams()
  const { updateTitle } = useContext(HeaderContext)
  const { state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  const tournament = tournamentState?.tournament

  useEffect(() => {
    if (tournament) {
      updateTitle(tournament.name)
    }
  }, [tournament])

  return <Detail tournamentId={tournamentId ?? ''} />
}