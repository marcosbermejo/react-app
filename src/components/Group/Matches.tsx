import { useContext, useEffect, useState } from "react";
import { TournamentsContext } from "../../state/Tournaments/context"
import { Alert, Button, Paper, Stack } from "@mui/material";
import Loading from "../../layout/Loading";
import Match from "../Match/Match";

export default function Matches({ tournamentId, groupId }: { tournamentId: string, groupId: string }) {
  const [page, setPage] = useState(1)
  const { loadMatches, matchesState } = useContext(TournamentsContext)
  const { matches, error, loading, hasNext, loadedPages } = matchesState[groupId] ?? {}

  useEffect(() => {
    loadMatches(groupId, page, true)
  }, [groupId, page])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!matches) return <></>

  return <>
    {
      matches.length === 0
        ? <Alert severity="warning">No hi ha partits definits per a aquest Grup</Alert>
        : <Stack spacing={2} flexGrow={1}>{matches.map((match) => <Paper key={match.id}><Match match={match} /></Paper>)}</Stack>
    }
    {
      hasNext && (
        loadedPages.includes(page)
          ? <>
            <Stack mb={2} justifyContent={'center'} alignItems={'center'}>
              <Button onClick={() => setPage(page + 1)} size={'large'} sx={{ maxWidth: 200 }} color="success" variant={'contained'}>Carregar més</Button>
            </Stack>
          </>
          : <Loading />
      )
    }
  </>
}
