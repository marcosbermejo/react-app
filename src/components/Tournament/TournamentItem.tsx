import { Typography, Card, CardContent, Stack, Box, Alert, Button, CardActions, Paper } from "@mui/material";
import Match from "../Match/Match";
import { useContext, useEffect, useRef } from "react";
import { TournamentsContext } from "../../contexts/TournamentsContext";
import Loading from "../../layout/Loading";
import { Link as RouterLink } from "react-router-dom";

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function Tournament({ id }: { id: string }) {
  const now = new Date()
  const { tournaments, loadMatches } = useContext(TournamentsContext)
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMatches(id)
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

  const { tournament, loaded, error } = tournaments.find(({ tournament }) => tournament.id === id) ?? {}

  const nextMatches = tournament?.matches
    .filter(match => match.homeTeam && match.awayTeam)
    .filter(match => match.date && match.date > now)
    .slice(0, 3)


  return (
    <Card variant="outlined" ref={ref as React.RefObject<HTMLDivElement>}>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" textAlign="center" lineHeight={1} >
          {tournament?.name && toTitleCase(tournament.name)}
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          {tournament?.category}
        </Typography>

        {!loaded && <Loading height="500px" />}

        {error && <Alert severity="error">{error}</Alert>}

        {loaded && (!nextMatches || nextMatches.length === 0) &&
          <>
            <Typography fontSize={60} textAlign={'center'} mt={2}>📋</Typography>
            <Typography textAlign="center" mb={2}>
              No hi ha partits definits per aquesta competició.
            </Typography>
          </>
        }

        {
          loaded && nextMatches && nextMatches?.length > 0 && 
          <Typography
            fontWeight='bold'
            variant='overline'
            textAlign='center'
            sx={{
              display: 'block',
              lineHeight: 1,
              paddingTop: 2,
              paddingBottom: 1
            }}>Propers partits</Typography>
        }

        {
          nextMatches?.map((match, i) => {
            const mt = i === 0 ? 0 : 2
            return <Box key={match.id} borderTop={1} mt={mt} mb={2} borderColor={'grey.500'}>
              <Match match={match} />
            </Box>
        })
        }

      </CardContent>
      <CardActions sx={{ justifyContent: 'center', mb: 2, px: 4 }}>
        <Button size={'large'} variant={'contained'} component={RouterLink} to={`/${id}`}>Detalls</Button>
      </CardActions>
    </Card>

  )
}