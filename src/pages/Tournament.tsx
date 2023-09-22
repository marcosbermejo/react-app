import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"

import { HeaderContext } from "../state/Header/context"
import { TournamentsContext } from "../state/Tournaments/context"
import Detail from "../components/Tournament/Detail"
import { Alert } from "@mui/material"
import Loading from "../layout/Loading"

export default function Tournament() {
  const { tournamentId } = useParams()
  const { updateTitle } = useContext(HeaderContext)
  const { loadTournaments, tournamentsState: { tournamentStates, error, loading } } = useContext(TournamentsContext)

  const tournamentState = tournamentStates.find(({ tournament }) => tournament.id === tournamentId)
  const tournament = tournamentState?.tournament

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    if (tournament) {
      updateTitle(tournament.name)
    }
  }, [tournament])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!tournament) return <></>

  return <Detail tournamentId={tournament.id} />
}