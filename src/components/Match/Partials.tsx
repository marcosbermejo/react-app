import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Match from "../../models/Match";
import { ReactNode } from "react";

function Cell ({ children, borderBottom = 1 }: { children: ReactNode, key?: string, borderBottom?: number }) {
  return <TableCell width={50} align="center" sx={{ p: 1, borderBottomWidth: borderBottom }}>{children}</TableCell>
}

export default function Partials({ match }: { match: Match }) {

  const hasPenalties = match.periods[4]?.homeTeamResult > 0 || match.periods[4]?.awayTeamResult > 0

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {match.periods.slice(0, 4).map((period, i) => <Cell key={period.id}>Q{i + 1}</Cell>)}
          {hasPenalties && <Cell>P</Cell>}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {match.periods.slice(0, 4).map(period => <Cell key={period.id}>{period.homeTeamResult}</Cell>)}
          {hasPenalties && <Cell>{match.periods[4].homeTeamResult}</Cell>}
        </TableRow>
        <TableRow>
          {match.periods.slice(0, 4).map(period => <Cell key={period.id} borderBottom={0}>{period.awayTeamResult}</Cell>)}
          {hasPenalties && <Cell borderBottom={0}>{match.periods[4].awayTeamResult}</Cell>}
        </TableRow>
      </TableBody>
    </Table>
  )
}