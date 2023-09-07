import { Typography, Card, CardContent, Stack, Box, Alert, Button, CardActions, Paper } from "@mui/material";
import ITournament from "../../interfaces/Tournament";
import Match from "../Match/Match";
import { format } from "date-fns";
import { useContext, useEffect, useRef } from "react";
import { TournamentsContext } from "../../providers/TournamentsProvider";

const formatDate = (date: Date) => format(date, 'dd/MM/yyyy')
const getTitle = (name: string) => name.split('-')?.[0] ?? ''
const getLeague = (name: string) => name.split('-')?.[1] ?? ''
const toTitleCase = (title: string) => title.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
)

const getDates = (tournament: ITournament) => {
  const firstMatchDate = tournament.groups?.[0]?.rounds?.[0]?.matches?.[0].date
  const lastMatchDate = tournament.groups?.at(-1)?.rounds?.at(-1)?.matches?.at(-1)?.date

  if (firstMatchDate && lastMatchDate) return `Del ${formatDate(firstMatchDate)} al ${formatDate(lastMatchDate)}`
  if (firstMatchDate) return formatDate(firstMatchDate)
  return ''
}

export default function Tournament({ tournament }: { tournament: ITournament }) {

  const { loadTournament } = useContext(TournamentsContext)
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
      <CardContent>
        <Typography color="text.secondary" fontSize="12px" textAlign="center">
          {getDates(tournament)}
        </Typography>
        <Typography variant="h6" textAlign="center" lineHeight={1} >
          {tournament.id}: {toTitleCase(getTitle(tournament.name))}
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          {toTitleCase(getLeague(tournament.name))}
        </Typography>

        <Box borderBottom={1} my={2} borderColor={'grey.500'}></Box>

        {tournament.nextMatches.map(match => <Match key={match.id} match={match} />)}

      </CardContent>
      <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button size="small" variant="outlined">Learn More</Button>
      </CardActions>
    </Card>

  )
}