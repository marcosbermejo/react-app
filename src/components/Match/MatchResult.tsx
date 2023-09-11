import { Box, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import IMatch from "../../models/Match";
import ITeam from "../../models/Team";
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

export default function Match({ match }: { match: IMatch }) {
  const { homeTeam, awayTeam } = match

  const day = match.date ? format(match.date, `dd/MM/yyyy`, { locale: ca }) : ''
  const hour = match.date ? format(match.date, 'HH:mm') : ''

  return (
    <TableContainer component={Box}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Round</TableCell>
            <TableCell>Dia</TableCell>
            <TableCell>Equip</TableCell>
            {match.periods.map(period => <TableCell>{period.name}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell rowSpan={2} sx={{}}><Typography fontSize={{xs: 12, md: 16}}>{match.round?.name}</Typography></TableCell>
            <TableCell rowSpan={2}><Typography fontSize={{xs: 12, md: 16}}>{day}<br />{hour}</Typography></TableCell>
            <TableCell><OptionalTeam team={homeTeam} /></TableCell>
            {match.periods.map(period => <TableCell>{period.homeTeamResult}</TableCell>)}
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell><OptionalTeam team={awayTeam} /></TableCell>
            {match.periods.map(period => <TableCell>{period.awayTeamResult}</TableCell>)}
          </TableRow>                        
        </TableBody>
      </Table>
    </TableContainer>
  )
}