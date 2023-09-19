import { useContext, useEffect } from "react"
import { TournamentsContext } from "../../state/Tournaments/context"
import { Box, Paper, Stack, Typography } from "@mui/material"
import Partials from "./Partials"
import Match from "./Match"
import IMatch from '../../models/Match'
import Scoring from "./Scoring"
import { format } from "date-fns"
import { ca } from "date-fns/locale"
import Referees from "./Referees"

export default function Detail({ tournamentId, groupId, match }: { tournamentId: string, groupId: string, match: IMatch }) {
  
  const { loadTournaments, tournamentsState } = useContext(TournamentsContext)

  useEffect(() => {
    loadTournaments()
  }, [])

  const tournamentName = tournamentsState.tournamentStates.find(({tournament}) => tournament.id === tournamentId)?.tournament.name
  const day = match.date ? format(match.date, `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM HH:mm`, { locale: ca }) : ''

  return (
    <>
      <Stack spacing={2}>
        <Box pt={4} pb={2} textAlign={'center'}>
          <Typography variant={'h6'}>{tournamentName}</Typography>
          <Typography sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{day}</Typography>
          <Typography>{match.round?.name}</Typography>
        </Box>

        <Box px={1}>
          <Match tournamentId={tournamentId} groupId={groupId} match={match} hideLink={true} />
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
            <Referees matchId={match.id} />
          </Paper>
        </Stack>

        <Stack px={2}>
          <Paper sx={{ py: 2 }}>
            <Typography fontSize={18} textAlign={'center'} fontWeight={'bold'}>Minut a minut</Typography>
          </Paper>
          <Scoring tournamentId={tournamentId} matchId={match.id} />
        </Stack>


      </Stack>
    </>
  )
}