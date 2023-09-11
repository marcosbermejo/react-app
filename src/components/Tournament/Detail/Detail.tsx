import { useContext, useEffect, useState } from "react"
import { TournamentsContext } from "../../../state/Tournaments/context"
import { Alert, Box, Paper, Stack, Tab, Tabs } from "@mui/material"
import Loading from "../../../layout/Loading"
import Match from "../../Match/Match"
import Filter from "./Filter"

export default function Detail({ tournamentId }: { tournamentId: string }) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const { loadTournaments, loadMatches, loadGroups, state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  const groupsState = tournamentState?.groupsState
  const matchesState = tournamentState?.matchesState

  const tournament = tournamentState?.tournament
  const groups = groupsState?.groups

  const onChangeGroup = (groupId: string) => {
    setSelectedGroup(groupId)
    localStorage.setItem(`tournament.${tournamentId}.selectedGroup`, groupId)
  }

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    if (tournament) {
      loadMatches(tournament.id)
      loadGroups(tournament.id)
    }
  }, [tournament])

  useEffect(() => {
    if (groups && groups.length > 0) {
      setSelectedGroup(localStorage.getItem(`tournament.${tournamentId}.selectedGroup`) || groups[0].id)
    }
  }, [groups])  

  if (state.error) return <Alert severity="error">{state.error}</Alert>
  if (state.loading) return <Loading />
  if (!state.loaded) return <></>

  if (!tournamentState) return (
    <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>
  )
  
  const matchesList = matchesState && matchesState.loaded 
    ? matchesState.matches.filter(match => match.round?.groupId == selectedGroup).map((match, i) => (
      <Paper key={match.id}>
        <Match match={match} />
      </Paper>
    ))
    : <Loading />

  return (
    <>
      <Box sx={{ px: 2, pt: 2 }}>
        {
          (groupsState && groupsState.loaded) && <Filter groups={groupsState.groups} selected={selectedGroup} onChange={onChangeGroup}/>
        }
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Partits" value={0} />
          <Tab label="Ranking" value={1} />
        </Tabs>
      </Box>

      <Stack spacing={2} flexGrow={1}>
        {selectedTab === 0 ? matchesList : <p>pepe</p>}
      </Stack>
    </>

  )



}