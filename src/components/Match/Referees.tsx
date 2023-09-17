import { useContext, useEffect } from "react"
import { TournamentsContext } from "../../state/Tournaments/context"
import { Alert, Typography } from "@mui/material"
import Loading from "../../layout/Loading"

export default function Referees({ matchId }: {matchId: string}) {

  const { loadReferees, refereesState } = useContext(TournamentsContext)

  useEffect(() => {
    loadReferees(matchId)
  }, [])

  const { resources: referees, error, loading } = refereesState[matchId] ?? {}

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!referees) return <></>

  return <>
    {referees.map(referee => <Typography key={referee.id} py={1} textTransform={'capitalize'}>{referee.name}</Typography>)}
  </>
}