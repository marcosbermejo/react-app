import { Typography, Card, CardContent, Stack, Box, Alert, Button, CardActions, Paper } from "@mui/material";
import ITournament from "../../interfaces/Tournament";
import Match from "../Match/Match";
import { useContext, useEffect, useRef } from "react";
import { TournamentsContext } from "../../contexts/TournamentsContext";
import Loading from "../../layout/Loading";
import { Link as RouterLink } from "react-router-dom";

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function Tournament({ tournament }: { tournament: ITournament }) {

  const { loadTournament, loadedTournaments } = useContext(TournamentsContext)
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadTournament(tournament.id)
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

  return (
    <Card variant="outlined" key={tournament.id} ref={ref as React.RefObject<HTMLDivElement>}>
      <CardContent sx={{pb: 0}}>
        <Typography variant="h6" textAlign="center" lineHeight={1} >
          {toTitleCase(tournament.name)}
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          { tournament.category }
        </Typography>

        {
          loadedTournaments.includes(tournament.id)
            ?
            tournament
              .nextMatches
              .filter(match => match.homeTeam && match.awayTeam)
              .slice(0, 3)
              .map(match => <Box key={match.id} borderTop={1} my={2} borderColor={'grey.500'}>
                <Match match={match} />
              </Box>)
            :
            <Loading height="500px" />
        }

      </CardContent>
      <CardActions sx={{ justifyContent: 'center', mb: 2, px:4 }}>
        <Button size={'large'} variant={'outlined'} fullWidth component={RouterLink} to={`/${tournament.id}`}>Veure més</Button>
      </CardActions>
    </Card>

  )
}