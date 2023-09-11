import { Typography, Card, CardContent, Box, Alert, Button, CardActions } from "@mui/material";
import Match from "../Match/Match";
import { useContext, useEffect, useRef } from "react";
import Loading from "../../layout/Loading";
import { Link as RouterLink } from "react-router-dom";
import { TournamentsContext } from "../../state/Tournaments/context";

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function Item({ tournamentId }: { tournamentId: string }) {
  const { state, loadMatches } = useContext(TournamentsContext)
  const { tournaments, loaded: listIsLoaded } = state

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMatches(tournamentId)
          observer.disconnect();
        }
      },
      { rootMargin: '-100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!listIsLoaded) return <></>

  const tournamentState = tournaments.find(({ tournament }) => tournament.id === tournamentId)
  if (!tournamentState) return <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>

  const { tournament } = tournamentState
  const { matches, loading, loaded, error } = tournamentState.matchesState

  const nextMatches = matches
    .filter(match => match.homeTeam && match.awayTeam)
    .filter(match => match.date && match.date > new Date())
    .slice(0, 3)

  const emptyMatches = (
    <>
      <Typography fontSize={60} textAlign={'center'} mt={2}>📋</Typography>
      <Typography textAlign="center" mb={2}>No hi ha partits definits per aquesta competició.</Typography>
    </>
  )

  const nextMatchesList = (
    <>
      <Typography fontWeight='bold' variant='overline' textAlign='center' sx={{
        display: 'block',
        lineHeight: 1,
        paddingTop: 2,
        paddingBottom: 1
      }}>Propers partits</Typography>

      {
        nextMatches.map((match, i) => {
          const mt = i === 0 ? 0 : 2
          return <Box key={match.id} borderTop={1} mt={mt} mb={2} borderColor={'grey.500'}>
            <Match match={match} />
          </Box>
        })
      }
    </>
  )

  return (
    <Card variant="outlined" ref={ref as React.RefObject<HTMLDivElement>}>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" textAlign="center" lineHeight={1} >
          {toTitleCase(tournament.name)}
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          {tournament.category}
        </Typography>

        {loading && <Loading height="500px" />}
        {error && <Alert severity="error">{error}</Alert>}

        {loaded && (nextMatches.length === 0 ? emptyMatches : nextMatchesList)}

      </CardContent>
      <CardActions sx={{ justifyContent: 'center', mb: 2, px: 4 }}>
        <Button size={'large'} variant={'contained'} component={RouterLink} to={`/${tournamentId}`}>Detalls</Button>
      </CardActions>
    </Card>

  )
}