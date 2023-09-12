import { Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import IMatch from "../../models/Match";
import { format } from "date-fns";
import { ca } from 'date-fns/locale'
import Team from "../Team/Team";

export default function Match({ match }: { match: IMatch }) {
  const { homeTeam, awayTeam } = match

  const day = match.date ? format(match.date, `EEEE, d ${[3, 7, 9].includes(match.date.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
  const hour = match.date ? format(match.date, 'HH:mm') : ''

  const detail = (
    <Stack height={'100%'} textAlign={'center'} fontSize={12} justifyContent={'center'} pb={1}>
      <Typography sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>
        {day}
      </Typography>
      <Typography fontSize={22} fontWeight={700}>
        {hour}
      </Typography>

      <Typography>{match.round?.name}</Typography>

      <Typography fontSize={12}>{match.facility}</Typography>

    </Stack>
  )

  const hasPenalties =  match.periods[4]?.homeTeamResult > 0 || match.periods[4]?.awayTeamResult > 0

  const partials = (
    <Table size="small">
      <TableHead>
        <TableRow>
          { match.periods.slice(0, 4).map(period => <TableCell key={period.id}>{period.name}</TableCell>)}
          { hasPenalties && <TableCell>P</TableCell> }
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          { match.periods.slice(0, 4).map(period => <TableCell key={period.id}>{period.homeTeamResult}</TableCell>)}
          { hasPenalties && <TableCell>{ match.periods[4].homeTeamResult}</TableCell> }
        </TableRow>
        <TableRow>
          {match.periods.slice(0, 4).map(period => <TableCell key={period.id}>{period.awayTeamResult}</TableCell>)}
          { hasPenalties && <TableCell>{ match.periods[4].awayTeamResult}</TableCell> }
        </TableRow>
      </TableBody>
    </Table>
  )

  return (
    <Grid container my={3}>
      <Grid item xs={3}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={6}>
        { match.finished && <Typography textAlign={'center'}>Finalitzat</Typography>}
        { match.finished && <Typography fontSize={22} fontWeight={700} textAlign={'center'}>{match.homeTeamResult} - {match.awayTeamResult}</Typography> }
        { match.finished ? partials : detail }
      </Grid>
      <Grid item xs={3}>
        <Team team={awayTeam} />
      </Grid>
    </Grid>
  )
}