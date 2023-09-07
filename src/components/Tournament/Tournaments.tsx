import React, { useContext, useEffect } from 'react';

import { Typography, Card, CardContent, Stack, Box, Alert } from "@mui/material";
import Tournament from "../../interfaces/Tournament";
import formatDate from "../../util/formatDate";
import Match from "../Match/Match";
import Loading from "../../layout/Loading";
import { TournamentsContext } from '../../providers/TournamentsProvider';

export default function Tournaments() {

  const { load, tournaments, error } = useContext(TournamentsContext)

  useEffect(() => load(), [])

  if (error) return <Alert severity="error">{error}</Alert>

  if (!tournaments) return <Loading />
  
  const getTitle = (name: string) => name.split('-')?.[0] ?? ''
  const getLeague = (name: string) => name.split('-')?.[1] ?? ''
  const toTitleCase = (title: string) => title.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )

  const getDates = (tournament: Tournament) => {
    const firstMatchDate = tournament.groups?.[0]?.rounds?.[0]?.matches?.[0].date
    const lastMatchDate = tournament.groups?.at(-1)?.rounds?.at(-1)?.matches?.at(-1)?.date

    if (firstMatchDate && lastMatchDate) return `Del ${formatDate(firstMatchDate)} al ${formatDate(lastMatchDate)}`
    if (firstMatchDate) return formatDate(firstMatchDate)
    return ''
  }

  return (
    <Stack spacing={2} pb={9}>
      {tournaments
        .filter(tournament => tournament.groups?.[0]?.rounds?.length > 0)
        .map((tournament) => (
          <Card variant="outlined" key={tournament.id}>
            <CardContent> 
              <Typography color="text.secondary" fontSize="12px" textAlign="center">
                {getDates(tournament)}
              </Typography>
              <Typography variant="h6" textAlign="center" lineHeight={1} >
                {toTitleCase(getTitle(tournament.name))}
              </Typography>
              <Typography color="text.secondary" textAlign="center" marginBottom={3}>
                {toTitleCase(getLeague(tournament.name))}
              </Typography>

              {tournament.nextMatch && <Match match={tournament.nextMatch} />}

            </CardContent>
          </Card>
        ))}
    </Stack>

  )
}