import { useContext, useEffect } from 'react';
import { Stack, Alert } from "@mui/material";
import Loading from "../../layout/Loading";
import { TournamentsContext } from '../../providers/TournamentsProvider';
import Tournament from './Tournament';

export default function Tournaments() {
  const { loadTournaments, tournaments, error } = useContext(TournamentsContext)

  useEffect(() => loadTournaments(), [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (!tournaments) return <Loading />
  
  return (
    <Stack spacing={2} pb={9}>
      {tournaments.map((tournament) => <Tournament key={tournament.id} tournament={tournament} /> )}
    </Stack>
  )
}