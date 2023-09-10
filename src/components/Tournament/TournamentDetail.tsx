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
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()

  const { tournamentId } = useParams()

  // Get tournament from Context
  const {
    tournament,
    loaded: tournamentLoaded,
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
      setSelectedGroupId(tournament.groups[0]?.id)
    }

  }, [tournament])

  // Errors and Loading pages when loading Tournaments
  if (loading) return <Loading height="500px" />
  if (error) return <Alert severity="error">{error}</Alert>

  // Errors and Loading pages when loading Matches for tournament
  if (!tournament) return <Alert severity="error">El Tournament amb id {tournamentId} no existeix</Alert>
  if (tournamentLoading) return <Loading height="500px" />
  if (tournamentError) return <Alert severity="error">{tournamentError}</Alert>

  if (!selectedGroupId) return <Loading height="500px"/>
  
  const selectedGroup = tournament.groups.find(group => group.id === selectedGroupId)
  if (!selectedGroup) return <Alert severity="error">El grup no existeix: {selectedGroupId}</Alert>

  const onChange = (event: SelectChangeEvent) => {
    setSelectedGroupId(event.target.value);
  };

  // const matches = tournament.matches.filter(match => match.round?.id === '17781290')
  // return <div><pre>{JSON.stringify(matches, null, 2) }</pre></div>
  
  return (
    <Stack spacing={2} pb={9} pt={2}>
      <Box sx={{ px: 2 }}>
        <FormControl fullWidth>
          <Select
            value={selectedGroupId}
            onChange={onChange}
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ backgroundColor: 'white' }}
          >
            {tournament.groups.map(({ name, id }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {
        selectedGroup.rounds.map(round => (
          <Card variant="outlined" key={round.id}>
            <CardContent sx={{ pb: 0 }}>
              <Typography variant="h6" textAlign="center" lineHeight={1} >
                {round.id}: {toTitleCase(round.name)}
              </Typography>

              {
                tournament.matches
                  .filter(match => match.round?.id === round.id)
                  .map(match => (
                    <Box key={match.id}>
                      <Match match={match} />
                    </Box>))
              }



            </CardContent>
          </Card>
        ))
      }
    </Stack>
  )
}
