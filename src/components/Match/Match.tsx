import { Box, Grid, Stack, Typography } from "@mui/material";
import IMatch from "../../interfaces/Match";
import Team from "../Team/Team";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'

export default function Match({ match }: { match: IMatch }) {
  const { date = '', homeTeam, awayTeam } = match

  if (!date || !homeTeam || !awayTeam) return <></>

  return (
    <Grid container>
      <Grid item xs={3}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={6} px={1}>
        <Stack height={'100%'} textAlign={'center'} fontSize={12}>
          <Typography>{ match.date && format(match.date, 'dd MMMM', {locale: ca}) }</Typography>
          <Typography>{ match.date && format(match.date, 'HH:mm') }</Typography>
          <Typography mt={1}>{ awayTeam.name }</Typography>
        </Stack>
      </Grid>
      <Grid item xs={3}>
        <Team team={awayTeam} />
      </Grid>
    </Grid>
  )
}