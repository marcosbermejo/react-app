import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Standing from "../../../models/Standing";

export default function Standings({ standings }: { standings: Standing[] }) {
  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>P</TableCell>
            <TableCell>PJ</TableCell>
            <TableCell>PG</TableCell>
            <TableCell>PE</TableCell>
            <TableCell>PP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            standings.sort((a, b) => a.position - b.position).map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell><strong>{row.score}</strong></TableCell>
                <TableCell>{row.played_matches}</TableCell>
                <TableCell>{row.won_matches}</TableCell>
                <TableCell>{row.drawn_matches}</TableCell>
                <TableCell>{row.lost_matches}</TableCell>
              </TableRow>))
          }
        </TableBody>
      </Table>
    </Paper>
  )
}