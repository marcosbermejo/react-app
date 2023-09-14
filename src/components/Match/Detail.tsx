import { useContext, useEffect } from "react"
import { TournamentsContext } from "../../state/Tournaments/context"
import Debug from "../../layout/Debug"
import Match from "./Match"
import Loading from "../../layout/Loading"

export default function Detail({ tournamentId, matchId }: { tournamentId: string, matchId: string }) {

  const { loadTournaments, loadMatches, loadMatch, state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  const tournament = tournamentState?.tournament
  const matchState = tournamentState?.matchesState.matches.find(({match}) => match.id === matchId)
  const match = matchState?.match

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    if (tournament) {
      loadMatches(tournament.id)
    }
  }, [tournament])

  useEffect(() => {
    if (match) {
      loadMatch(match.tournamentId, match.id)
    }
  }, [match])

  if (!match) return <Loading />

  return (
    <>
      <Match match={match} />
    </>
  )
}