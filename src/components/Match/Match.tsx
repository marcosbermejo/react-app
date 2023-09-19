import { Link, Grid, Stack, Typography, Chip, Box } from "@mui/material";

import IMatch from "../../models/Match";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'
import Team from "../Team/Item";
import { Link as RouterLink } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface MatchProps { tournamentId: string, groupId: string, match: IMatch, hideLink?: boolean }
export default function Match({ tournamentId, groupId, match, hideLink = false }: MatchProps) {
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
      <Grid item xs={4}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={4} px={1}>
        <Stack height={'100%'} textAlign={'center'} alignItems={'center'} justifyContent={hideLink ? 'flex-start' : 'space-between'}>
          {status && <Stack justifyContent={'center'} direction={'row'}><Chip label={status.label} color={status.color} variant="outlined" size="small" /></Stack>}

          {
            match.finished
              ? <>
                <Box>
                  <Typography lineHeight={1} fontSize={28} fontWeight={700}>{match.homeTeamResult} - {match.awayTeamResult}</Typography>
                  <Typography fontSize={12} sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{match.date && format(match.date, 'dd/MM/yy')}</Typography>
                </Box>

                {!hideLink && <Link display={'flex'} flexDirection={'row'} underline="none" component={RouterLink} to={`/${tournamentId}/groups/${groupId}/matches/${match.id}`}>Detalls <ChevronRightIcon /></Link>}
              </>
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
        {!match.finished && (
          <Typography display={'flex'} fontSize={12} alignItems={'center'} px={2} mt={2}>
            <LocationOnIcon sx={{ mr: 1, fontSize: 14 }} />
            {match.facility}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}