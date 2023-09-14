import { useContext, useEffect } from "react";
import { HeaderContext } from "../state/Header/context";
import { useParams } from "react-router-dom";
import { TournamentsContext } from "../state/Tournaments/context";
import Detail from "../components/Match/Detail";

export default function Match () {
  const { tournamentId, matchId } = useParams()
  const { updateTitle } = useContext(HeaderContext)
  const { state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) =>tournament.id === tournamentId)
  const matchState = tournamentState?.matchesState.matches.find(({match}) => match.id === matchId)
  const match = matchState?.match

  useEffect(() => {
    if (match) {
      updateTitle(`${match.homeTeam?.name ?? '?'} - ${match.awayTeam?.name ?? '?'}`)
    }
  }, [match])

  return <Detail tournamentId={tournamentId ?? ''} matchId={matchId ?? ''}/>
}