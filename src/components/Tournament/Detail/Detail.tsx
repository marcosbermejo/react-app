import { useContext, useEffect, useState } from "react"
import { TournamentsContext } from "../../../state/Tournaments/context"
import { Alert, Box, Paper, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs } from "@mui/material"
import Loading from "../../../layout/Loading"
import Match from "../../Match/Match"
import Filter from "./Filter"
import { match } from "assert"
import Standings from "./Standings"
import Debug from "../../../layout/Debug"
import Brackets from "./Brackets"

export default function Detail({ tournamentId }: { tournamentId: string }) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const { loadTournaments, loadMatches, loadGroups, state } = useContext(TournamentsContext)

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  const groupsState = tournamentState?.groupsState
  const matchesState = tournamentState?.matchesState

  const tournament = tournamentState?.tournament
  const groups = groupsState?.groups

  const onChangeGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    localStorage.setItem(`tournament.${tournamentId}.selectedGroupId`, groupId)
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
      setSelectedGroupId(localStorage.getItem(`tournament.${tournamentId}.selectedGroupId`) || groups[0].id)
    }
  }, [groups])  

  if (state.error) return <Alert severity="error">{state.error}</Alert>
  if (state.loading) return <Loading />
  if (!state.loaded) return <></>

  if (!tournamentState) return (
    <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>
  )
  
  const matchesList = matchesState && matchesState.loaded 
    ? matchesState.matches
      .filter(({match}) => match.round?.groupId == selectedGroupId)
      .filter(({match}) => match.date)
      .map(({match}, i) => (
      <Paper key={match.id}>
        <Match match={match} />
      </Paper>
    ))
    : <Loading />

  const group = groupsState?.groups.find(group => group.id === selectedGroupId)

  const ranking = group 
    ? (group?.type === 'play_off' ? <Brackets rounds={group.rounds} matches={matchesState?.matches.map(({match}) => match)} /> : <Standings standings= {group.standings} />)
    : <Loading />

  return (
    <>
      <Box sx={{ px: 2, pt: 2 }}>
        {
          (groupsState && groupsState.loaded) && <Filter groups={groupsState.groups} selected={selectedGroupId} onChange={onChangeGroup}/>
        }
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Partits" value={0} />
          <Tab label="Ranking" value={1} />
        </Tabs>
      </Box>

      
      {selectedTab === 0 ? <Stack spacing={2} flexGrow={1}>{matchesList}</Stack> : ranking}
      
    </>
  )
}