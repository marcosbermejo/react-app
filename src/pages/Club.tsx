import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"

import { HeaderContext } from "../state/Header/context"
import { ClubsContext } from "../state/Clubs/context"
import Detail from "../components/Club/Detail"
import { Alert } from "@mui/material"
import Loading from "../layout/Loading"

export default function Club() {
  const { clubId } = useParams()
  const { updateTitle } = useContext(HeaderContext)
  const { loadClubs, clubsState: { clubStates, error, loading } } = useContext(ClubsContext)

  const clubState = clubStates.find(({ club }) => club.id === clubId)
  const club = clubState?.club

  useEffect(() => {
    loadClubs()
    updateTitle('Club')
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!club) return <></>

  return <Detail clubId={club.id} />
}