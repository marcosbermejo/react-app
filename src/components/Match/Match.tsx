import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import IMatch from "../../interfaces/Match";
import ITeam from "../../interfaces/Team";
import Team from "../Team/Team";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'

function OptionalTeam({ team }: { team: ITeam | undefined }) {
  if (team) return <Team team={team} />

  return (
    <Stack alignItems="center">
      <Box
        bgcolor={'grey.300'}
        width={80}
        height={80}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}>
        <QuestionMarkIcon />
      </Box>
    </Stack>

  )
}

export default function Match({
  match,
  showDate = true,
  showRound = true,
  showFacility = true
}: {
  match: IMatch,
  showDate?: boolean,
  showRound?: boolean,
  showFacility?: boolean,
}) {
  const { homeTeam, awayTeam } = match

  const day = match.date ? format(match.date, `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
  const hour = match.date ? format(match.date, 'HH:mm') : ''

  return (
    <Grid container my={3}>
      <Grid item xs={3}>
        <OptionalTeam team={homeTeam} />
      </Grid>
      <Grid item xs={6} px={1}>
        <Stack height={'100%'} textAlign={'center'} fontSize={12} justifyContent={'center'} pb={1}>
          {
            showDate && <>
              <Typography sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>
                {day}
              </Typography>
              <Typography fontSize={22} fontWeight={700}>
                {hour}
              </Typography>
            </>
          }

          {
            showRound && <Typography>{match.roundName}</Typography>
          }

          {
            showFacility && <Typography fontSize={12}>{match.facility}</Typography>
          }

        </Stack>
      </Grid>
      <Grid item xs={3}>
        <OptionalTeam team={awayTeam} />
      </Grid>
    </Grid>
  )
}