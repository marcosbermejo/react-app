import { Link, Grid, Stack, Typography, Chip, Box } from "@mui/material";

import IMatch from "../../models/Match";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'
import Team from "../Team/Item";
import { Link as RouterLink } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface MatchProps { match: IMatch, hideLink?: boolean, showTournamentName?: boolean }
export default function Match({ match, hideLink = false, showTournamentName = false }: MatchProps) {
  const { homeTeam, awayTeam } = match

  const day = match.date ? format(match.date, `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
  const hour = match.date ? format(match.date, 'HH:mm') : ''

  const getStatus = (match: IMatch): { label: string, color: 'success' | 'warning' | 'error' } | undefined => {
    if (match.finished) return { label: 'Finalitzat', color: 'success' }
    if (match.postponed) return { label: 'Postposat', color: 'warning' }
    if (match.canceled) return { label: 'Postposat', color: 'error' }
  }

  const status = getStatus(match)

  return (
    <Grid container py={2}>
      {match.tournament && showTournamentName && <Grid item xs={12}>
        <Typography borderBottom={1} pb={2} mb={2} fontSize={14} textAlign={'center'} fontWeight={'bold'}>{match.tournament?.name}</Typography>
      </Grid>}
      <Grid item xs={4}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={4} px={1}>
        <Stack height={'100%'} textAlign={'center'} alignItems={'center'}>
          {status && <Stack justifyContent={'center'} direction={'row'} mb={2}><Chip label={status.label} color={status.color} variant="outlined" size="small" /></Stack>}

          {
            match.finished
              ?
              <Box>
                <Typography lineHeight={1} fontSize={28} fontWeight={700} mb={1}>{match.homeTeamResult} - {match.awayTeamResult}</Typography>
                <Typography fontSize={12} sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{match.date && format(match.date, 'dd/MM/yy')}</Typography>
              </Box>
              : <>
                <Typography sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{day}</Typography>
                <Typography fontSize={28} fontWeight={700}>{hour}</Typography>
                <Typography sx={{ userSelect: 'none' }}>{match.round?.name}</Typography>
              </>
          }


        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Team team={awayTeam} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction='row' px={2} mt={2} justifyContent={'space-between'} alignItems={'center'}>
          <Typography display={'flex'} alignItems={'center'}>
            <LocationOnIcon sx={{ mr: 1, fontSize: 14 }} />
            {match.facility}
          </Typography>
          {!hideLink && <Link display={'flex'} flexDirection={'row'} underline="none" component={RouterLink} to={`/${match.tournament.id}/groups/${match.round?.groupId}/matches/${match.id}`}>Detalls <ChevronRightIcon /></Link>}
        </Stack>

      </Grid>
    </Grid>
  )
}