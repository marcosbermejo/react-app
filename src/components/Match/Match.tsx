import { Box, Grid, Stack, Typography } from "@mui/material";
import IMatch from "../../interfaces/Match";
import IGroup from "../../interfaces/Group";
import Team from "../Team/Team";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'

export default function Match({ match }: { match: IMatch }) {
  const { date = '', homeTeam, awayTeam } = match

  if (!date || !homeTeam || !awayTeam) return <></>

  const dayFormat = match.date ? `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM` : ''

  return (
    <Grid container my={3}>
      <Grid item xs={3}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={6} px={1}>
        <Stack height={'100%'} textAlign={'center'} fontSize={12} justifyContent={'center'} pb={1}>         
          <Typography sx={{ '&::first-letter': { textTransform: 'uppercase'}}}>
            { match.date && format(match.date, dayFormat, {locale: ca}) }
          </Typography>
          <Typography fontSize={22} fontWeight={700}>
            { match.date && format(match.date, 'HH:mm') }
          </Typography>
          <Typography>
            { match.roundName }
          </Typography>
          <Typography fontSize={12}>
            { match.facility }
          </Typography>          
        </Stack>
      </Grid>
      <Grid item xs={3}>
        <Team team={awayTeam} />
      </Grid>
    </Grid>
  )
}