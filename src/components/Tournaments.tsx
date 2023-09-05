import { Typography, Button, Card, CardActions, CardContent, Stack } from "@mui/material";
import Tournament from "../data/interfaces/Tournament";
import { format } from 'date-fns'
import Match from "../data/interfaces/Match";

export default function Tournaments({ tournaments }: { tournaments: Tournament[] }) {

  const toTitleCase = (title: string) => title.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )

  const formatDate = (date: Date | null, hour = false): string => {
    if (!date) return ''
    return format(date, `dd/MM/yyyy${hour ? ' HH:mm' : ''}`)
  }

  const subtitle = (tournament: Tournament) => {
    const firstMatchDate = tournament.groups?.[0]?.rounds?.[0]?.matches?.[0].date
    const lastMatchDate = tournament.groups?.at(-1)?.rounds?.at(-1)?.matches?.at(-1)?.date

    if (firstMatchDate && lastMatchDate) return `Del ${formatDate(firstMatchDate)} al ${formatDate(lastMatchDate)}`
    if (firstMatchDate) return formatDate(firstMatchDate)

    return 'Sense dates'
  }

  const nextMatch = (tournament: Tournament) => {
    return tournament.nextMatch ? (
    <span>
      Proper partit:&nbsp; 
      <strong>{tournament.nextMatch.homeTeam?.name}</strong> VS&nbsp; 
      <strong>{tournament.nextMatch.awayTeam?.name}</strong>&nbsp; 
      ({formatDate(tournament.nextMatch.date, true)})
    </span>) : ''
    
  }

  return (
    <Stack spacing={2}>
      {tournaments.map((tournament) => (
        <Card variant="outlined" key={tournament.id}>
          <CardContent>
            <Typography variant="h5" component="div">
              {toTitleCase(tournament.name)}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {subtitle(tournament)}
            </Typography>
            <Typography variant="body2">
              { nextMatch(tournament) }
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  )
}