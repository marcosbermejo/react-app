import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TournamentsContext } from "../../../contexts/Tournaments/TournamentsContext"
import { Box, Alert, Paper, FormControl, Select, Stack, SelectChangeEvent, MenuItem, Tabs, Tab } from "@mui/material"
import Loading from "../../../layout/Loading"
import { HeaderContext } from "../../../contexts/HeaderContext"
import TournamentMatches from "./TournamentMatches"
import GroupStandings from "./TournamentStandings"

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

export default function TournamentDetail() {
  const { updateTitle, updatePrevious } = useContext(HeaderContext)
  const { tournaments, loaded, loading, error, loadTournaments } = useContext(TournamentsContext)
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()
  const [selectedTab, setSelectedTab] = useState(0);

  const { tournamentId } = useParams()

  // Get tournament from Context
  const { tournament } = tournaments.find(({ tournament }) => tournament.id === tournamentId) ?? {}

  useEffect(() => {
    updatePrevious('/')
    if (!loaded) loadTournaments()
  }, [])

  useEffect(() => {
    if (tournament) {
      updateTitle(toTitleCase(tournament.name))
      setSelectedGroupId(tournament.groups[0]?.id)
    }
  }, [tournament])

  // Errors and Loading pages when loading Tournaments
  if (loading) return <Loading height="500px" />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!tournament) return <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>
  if (!selectedGroupId) return <Loading height="500px" />

  const selectedGroup = tournament.groups.find(group => group.id === selectedGroupId)
  if (!selectedGroup) return <Alert severity="error">El grup amb id {selectedGroupId} no existeix.</Alert>

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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} aria-label="basic tabs example">
          <Tab label="Partits" value={0} />
          <Tab label="Ranking" value={1} />
        </Tabs>
      </Box>

      <Paper>
        { selectedTab === 0 && <TournamentMatches tournament={tournament} group={selectedGroup} />}
      </Paper>

      <Paper>
        { selectedTab === 1 && <GroupStandings tournament={tournament} group={selectedGroup} />}
      </Paper>

    </Stack>
  )
}
