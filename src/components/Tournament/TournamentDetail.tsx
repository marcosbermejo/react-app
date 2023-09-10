import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TournamentsContext } from "../../contexts/TournamentsContext"
import { Box, Typography, Card, CardContent, Alert, Paper, FormControl, Select, Stack, SelectChangeEvent, MenuItem } from "@mui/material"
import Loading from "../../layout/Loading"
import { HeaderContext } from "../../contexts/HeaderContext"
import Match from "../Match/Match"
import Group from "../../interfaces/Group"

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function TournamentDetail() {
  const { updateTitle, updatePrevious } = useContext(HeaderContext)
  const { tournaments, loaded, loading, error, loadTournaments, loadMatches } = useContext(TournamentsContext)
  const { tournamentId } = useParams()

  // Get tournament from Context
  const {
    tournament,
    loading: tournamentLoading,
    error: tournamentError
  } = tournaments.find(({ tournament }) => tournament.id === tournamentId) ?? {}

  // At first charge, loads all tournaments if not loaded already (when page is loaded directly)
  useEffect(() => {
    if (!loaded) loadTournaments()
    updatePrevious('/')
  }, [])

  // When tournament is loaded, load its matches
  useEffect(() => {
    if (tournament) {
      updateTitle(toTitleCase(tournament.name))
      loadMatches(tournament.id)
    }

  }, [tournament])

  // Errors and Loading pages when loading Tournaments
  if (loading) return <Loading height="500px" />
  if (error) return <Alert severity="error">{error}</Alert>

  // Errors and Loading pages when loading Matches for tournament
  if (!tournament) return <Alert severity="error">El Tournament amb id {tournamentId} no existeix</Alert>
  if (tournamentLoading) return <Loading height="500px" />
  if (tournamentError) return <Alert severity="error">{tournamentError}</Alert>



  return (
    <Stack spacing={2} pb={9} pt={2}>
      {
        tournament.matches
          .map(match => (
            <Paper key={match.id} sx={{my: 2}}>
              <Match match={match} />
            </Paper>))
      }
    </Stack>
  )
}