import { useContext, useEffect, useState } from "react"
import { TournamentsContext } from "../../state/Tournaments/context"
import { Alert } from "@mui/material"
import Loading from "../../layout/Loading"
import GroupDetail from "../Group/Detail"
import Filter from "../Group/Filter"

export default function Detail({ tournamentId }: { tournamentId: string }) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const { loadGroups, groupsState } = useContext(TournamentsContext)

  const { groups, error, loading } = groupsState[tournamentId] ?? {}

  useEffect(() => {
    loadGroups(tournamentId)
  }, [])

  useEffect(() => {
    if (groups && groups.length > 0) {
      setSelectedGroupId(localStorage.getItem(`tournament.${tournamentId}.selectedGroupId`) || groups[0].id)
    }
  }, [groups])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!groups) return <></>

  if (groups.length === 0) return <Alert severity="warning">No hi ha grups definits per a aquesta competició</Alert>

  const onChange = (groupId: string) => {
    setSelectedGroupId(groupId)
    localStorage.setItem(`tournament.${tournamentId}.selectedGroupId`, groupId)
  }

  const group = groups.find(({id}) => id === selectedGroupId)
  if (!group) return <></>

  return (
    <>
      <Filter groups={groups} selectedGroupId={selectedGroupId} onChange={onChange} />
      { group && <GroupDetail tournamentId={tournamentId} group={group} /> }
    </>
  )
}