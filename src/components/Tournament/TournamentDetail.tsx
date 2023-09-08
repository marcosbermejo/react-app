import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TournamentsContext } from "../../contexts/TournamentsContext"
import { Box, Typography, Card, CardContent, Alert, Paper, FormControl, Select, Stack, SelectChangeEvent, MenuItem } from "@mui/material"
import Loading from "../../layout/Loading"
import { HeaderContext } from "../../contexts/HeaderContext"
import Match from "../Match/Match"

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function TournamentDetail() {
  const { updateTitle, updatePrevious } = useContext(HeaderContext)

  const { tournaments, loadTournament } = useContext(TournamentsContext)
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()

  const { tournamentId } = useParams()

  const tournament = tournaments?.find(t => t.id === tournamentId)

  useEffect(() => {
    updatePrevious('/')
    loadTournament(tournamentId ?? '')
  }, [])

  useEffect(() => {
    updateTitle(tournament?.name ? toTitleCase(tournament.name) : '')
    setSelectedGroupId(tournament?.groups[0]?.id)
  }, [tournament])

  if (!tournament) return <Loading />

  if (tournament.groups.length === 0) return (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" textAlign="center">
          No hi ha Grups definits per al Tournament <em>{tournament.name}</em>.
        </Typography>
        <Typography fontSize={60} textAlign={'center'} my={4}>🤽‍♀️</Typography>
      </CardContent>
    </Card>
  )

  if (!selectedGroupId) return <Loading />

  const selectedGroup = tournament.groups.find(group => group.id === selectedGroupId)
  if (!selectedGroup) return <Alert severity="error">El grup no existeix: {selectedGroupId}</Alert>

  const onChange = (event: SelectChangeEvent) => {
    setSelectedGroupId(event.target.value);
  };

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
                {toTitleCase(round.name)}
              </Typography>

              {
                round.matches.map(match => <Box key={match.id}>
                  <Match match={match} showRound={false} />
                </Box>)
              }

            </CardContent>
          </Card>
        ))
      }


    </Stack>

  )

}