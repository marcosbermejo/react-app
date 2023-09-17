import { Alert, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useContext, useEffect } from "react";
import { TournamentsContext } from "../../state/Tournaments/context";
import Loading from "../../layout/Loading";

export default function Standings({ tournamentId, groupId }: { tournamentId: string, groupId: string }) {
  const { loadStandings, standingsState } = useContext(TournamentsContext)

  const { resources: standings, error, loading } = standingsState[groupId] ?? {}

  useEffect(() => {
    loadStandings(groupId)
  }, [groupId])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!standings) return <></>
  
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