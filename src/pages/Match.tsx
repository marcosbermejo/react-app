import { useContext, useEffect } from "react";
import { HeaderContext } from "../state/Header/context";
import { useParams } from "react-router-dom";
import Detail from "../components/Match/Detail";
import { TournamentsContext } from "../state/Tournaments/context";
import { Alert } from "@mui/material";
import Loading from "../layout/Loading";

export default function Match () {
  const { tournamentId, matchId } = useParams()
  const { updateTitle } = useContext(HeaderContext)
  const { loadMatches, matchesState } = useContext(TournamentsContext)

  useEffect(() => {
    updateTitle('Partit')
    if (tournamentId) {
      loadMatches(tournamentId)
    }
  }, [tournamentId])

  if (!tournamentId || !matchId) return <></>

  const { resources: matches, error, loading } = matchesState[tournamentId] ?? {}

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!matches) return <></>

  const match = matches.find(match => match.id === matchId)
  if (!match) return <></>

  return <Detail tournamentId={tournamentId} match={match}/>
}