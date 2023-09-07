import { Typography, Card, CardContent, Stack, Box, Alert, Button, CardActions, Paper } from "@mui/material";
import ITournament from "../../interfaces/Tournament";
import Match from "../Match/Match";
import { format } from "date-fns";
import { useContext, useEffect, useRef } from "react";
import { TournamentsContext } from "../../providers/TournamentsProvider";
import Loading from "../../layout/Loading";

const getTitle = (name: string) => name.split('-')?.[0] ?? ''
const toTitleCase = (title: string) => title.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
)

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
          {toTitleCase(getTitle(tournament.name))}
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
      <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button size="small" variant="outlined">Veure més</Button>
      </CardActions>
    </Card>

  )
}