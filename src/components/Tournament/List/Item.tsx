import { Typography, Card, CardContent, Box, Alert, Button, CardActions, CardProps } from "@mui/material";
import Match from "../../Match/Match";
import { ReactNode, useContext, useEffect, useRef } from "react";
import Loading from "../../../layout/Loading";
import { Link as RouterLink } from "react-router-dom";
import { TournamentsContext } from "../../../state/Tournaments/context";
import Debug from "../../../layout/Debug";
import React from "react";

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

const ItemCard = React.forwardRef<any, CardProps>(({ children, ...props }, ref) => (
  <Card {...props} variant="outlined" ref={ref as React.RefObject<HTMLDivElement>}>
    <CardContent sx={{ pb: 0, height: '100%' }}>
      {children}
    </CardContent>
  </Card>
))


export default function Item({ tournamentId }: { tournamentId: string }) {
  const ref = useRef<HTMLDivElement>();
  const { loadMatches, state } = useContext(TournamentsContext)

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

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  if (!tournamentState) return (
    <ItemCard>
      <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>
    </ItemCard>
  )

  const { matches, loading, loaded, error } = tournamentState.matchesState
  const { tournament } = tournamentState

  const nextMatches = matches
    .filter(match => match.homeTeam || match.awayTeam)
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
    <ItemCard sx={{ height: loaded ? 'none' : '500px' }} ref={ref as React.RefObject<HTMLDivElement>}>
      <Typography variant="h6" textAlign="center" lineHeight={1} >
        {toTitleCase(tournament.name)}
      </Typography>

      <Typography color="text.secondary" textAlign="center">
        {tournament.category}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Loading />}
      {loaded ? (nextMatches.length === 0 ? emptyMatches : nextMatchesList) : <></>}

      {
        loaded && nextMatches.length > 0 && (
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button size={'large'} variant={'contained'} component={RouterLink} to={`/${tournamentId}`}>Detalls</Button>
          </CardActions>
        )
      }
    </ItemCard>
  )
}
