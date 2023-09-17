import { useContext, useEffect } from "react";
import { TournamentsContext } from "../../state/Tournaments/context"
import { Alert, Paper, Stack } from "@mui/material";
import Loading from "../../layout/Loading";
import Match from "../Match/Match";

export default function Matches({ tournamentId, groupId }: { tournamentId: string, groupId: string }) {
  const { loadMatches, matchesState } = useContext(TournamentsContext)
  const { resources: matches, error, loading } = matchesState[tournamentId] ?? {}

  useEffect(() => {
    loadMatches(tournamentId)
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!matches) return <></>
  
  const filteredMatches = matches
    .filter((match) => match.round?.groupId == groupId)
    .filter((match) => match.date)

  return <>
    {
      filteredMatches.length === 0
        ? <Alert severity="warning">No hi ha partits definits per a aquest Grup</Alert>
        : <Stack spacing={2} flexGrow={1}>{filteredMatches.map((match) => <Paper key={match.id}><Match match={match} /></Paper>)}</Stack>
    }
  </>
}
