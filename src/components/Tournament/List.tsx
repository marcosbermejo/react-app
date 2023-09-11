import React, { useContext } from 'react';
import { Stack, Typography, CardContent, Card } from "@mui/material";

import Item from './Item';
import { TournamentsContext } from '../../state/Tournaments/context';

export default function List({ category }: { category: string }) {
  const { state } = useContext(TournamentsContext)
  const { tournaments, loaded } = state

  if (!loaded) return <></>

  const filteredTournamentStates = tournaments.filter(({ tournament }) => tournament.category === category)

  const emptyList = (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" textAlign="center">
          No hi ha competicions per la categoria <em>{category}</em>.
        </Typography>
        <Typography fontSize={60} textAlign={'center'} my={4}>🤽‍♀️</Typography>
      </CardContent>
    </Card>
  )

  const list = filteredTournamentStates.map(({ tournament }) => (
    <Item key={tournament.id} tournamentId={tournament.id} />
  ))

  return (
    <Stack spacing={2} pb={9} pt={2}>
      { filteredTournamentStates.length === 0 ? emptyList : list }
    </Stack>
  )
}