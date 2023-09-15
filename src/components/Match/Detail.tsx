import { useContext, useEffect } from "react"
import { TournamentsContext } from "../../state/Tournaments/context"
import Loading from "../../layout/Loading"
import { Box, Paper, Stack, Typography } from "@mui/material"
import Partials from "./Partials"
import Match from "./Match"
import Scoring from "./Scoring"
import { format } from "date-fns"
import { ca } from "date-fns/locale"

export default function Detail({ tournamentId, matchId }: { tournamentId: string, matchId: string }) {
  const { loadTournaments, loadMatches, loadMatch, state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  const tournament = tournamentState?.tournament
  const matchState = tournamentState?.matchesState.matches.find(({ match }) => match.id === matchId)
  const match = matchState?.match

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    if (tournament) {
      loadMatches(tournament.id)
    }
  }, [tournament])

  useEffect(() => {
    if (match) {
      loadMatch(match.tournamentId, match.id)
    }
  }, [match])

  if (!match) return <Loading />

  const day = match.date ? format(match.date, `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM HH:mm`, { locale: ca }) : ''

  return (
    <>
      <Stack spacing={2}>
        <Box pt={4} pb={2} textAlign={'center'}>
          <Typography variant={'h6'}>{tournament?.name}</Typography>
          <Typography sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{day}</Typography>
          <Typography>{match.round?.name}</Typography>
        </Box>

        <Box px={1}>
          <Match match={match} hideLink={true} />
        </Box>

        <Stack px={2}>
          <Paper sx={{ pb: 2 }}>
            <Typography py={2} fontSize={18} textAlign={'center'} fontWeight={'bold'}>Parcials</Typography>
            <Partials match={match} />
          </Paper>
        </Stack>

        <Stack px={2}>
          <Paper sx={{ pb: 2, textAlign: 'center' }}>
            <Typography py={2} fontSize={18} textAlign={'center'} fontWeight={'bold'}>Àrbitres</Typography>
            {match.referees.map(referee => <Typography key={referee.id} py={1} textTransform={'capitalize'}>{referee.name}</Typography>)}
          </Paper>
        </Stack>

        <Stack px={2}>
          <Paper sx={{ py: 2 }}>
            <Typography fontSize={18} textAlign={'center'} fontWeight={'bold'}>Minut a minut</Typography>
          </Paper>
          <Scoring scoring={match.scoring} />
        </Stack>


      </Stack>
    </>
  )
}