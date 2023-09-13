import { Typography, Card, CardContent, Box, Alert, Button, CardProps, Stack } from "@mui/material";
import Match from "../../Match/Match";
import { useContext, useEffect, useRef } from "react";
import Loading from "../../../layout/Loading";
import { Link as RouterLink } from "react-router-dom";
import { TournamentsContext } from "../../../state/Tournaments/context";
import React from "react";
import { format } from "date-fns";
import { ca } from "date-fns/locale";

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
      <Typography py={2} fontWeight='bold' textAlign='left' sx={{
        display: 'block',
        lineHeight: 1,
        borderTop: 1
      }}>Propers partits:</Typography>

      {
        nextMatches.map((match, i) => {
          const bb = i === nextMatches.length -1 ? 0 : 1
          const mb = i === nextMatches.length -1 ? 0 : 2
          const mt = i === 0 ? 0 : 2

          return <Box key={match.id} borderBottom={bb} mb={mb} mt={mt} borderColor={'grey.500'}>
            <Match match={match} />
          </Box>
        })
      }
    </>
  )

  const dateTitle = () => {
    const matchesWithDate = matches.filter(match => match.date)
    const firstMatchDate = matchesWithDate.length > 0 ? matchesWithDate[0].date : ''
    const lastMatchDate = matchesWithDate.length > 1 ? matchesWithDate.at(-1)?.date : ''
    const firstDate = firstMatchDate ? format(firstMatchDate, `d ${[3, 7, 9].includes(firstMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
    const lastDate = lastMatchDate ? format(lastMatchDate, `d ${[3, 7, 9].includes(lastMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''      
    return (firstDate && lastDate) ? `Del ${firstDate} al ${lastDate}` : (firstDate || lastDate)
  }

  return (
    <ItemCard sx={{ height: loaded ? 'none' : '500px' }} ref={ref as React.RefObject<HTMLDivElement>}>
      <Stack flexDirection={'row'} pb={2} alignItems={'center'}>
        <Box>
          <Typography variant="h6" lineHeight={1} >
            {toTitleCase(tournament.name)}
          </Typography>

          <Typography mt={1} >
            {tournament.category}
          </Typography>

          <Typography  color="text.secondary" fontSize={14}>
            { matches ? dateTitle() : ''}
          </Typography>
        </Box>
        <Box display={'flex'} flexGrow={1} justifyContent={'center'}>
          <Button variant={'contained'} component={RouterLink} to={`/${tournamentId}`}>Detalls</Button>
        </Box>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Loading />}
      {loaded ? (nextMatches.length === 0 ? emptyMatches : nextMatchesList) : <></>}

    </ItemCard>
  )
}
