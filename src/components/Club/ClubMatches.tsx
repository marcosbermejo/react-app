import { useContext, useEffect, useState } from "react";
import { ClubsContext } from "../../state/Clubs/context";
import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import Loading from "../../layout/Loading";
import Match from "../Match/Match";

export default function ClubMatches({ clubId }: { clubId: string }) {
  const { loadMatches, matchesState } = useContext(ClubsContext)
  const { resources: matches, error, loading, hasNext, loadedPages } = matchesState[clubId] ?? {}

  useEffect(() => {
    loadMatches(clubId, 1)
  }, [clubId])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!matches) return <></>

  return <>
    {
      matches.length === 0
        ? <Alert severity="warning">No hi ha partits definits per a aquest Club</Alert>
        : <Stack spacing={2} flexGrow={1} useFlexGap={true}>
            {
              matches.map((match) => (
                <Paper key={match.id}>
                  <Match match={match} showTournamentName={true} />
                </Paper>
              ))
            }
          </Stack>
    }
  </>

}