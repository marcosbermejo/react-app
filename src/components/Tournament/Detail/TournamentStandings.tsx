import { useContext, useEffect, useState } from "react"
import { TournamentsContext } from "../../../contexts/Tournaments/TournamentsContext"
import Loading from "../../../layout/Loading"
import Match from "../../Match/Match"
import Group from "../../../models/Group"
import Tournament from "../../../models/Tournament"

export default function GroupStandings({ tournament, group }: { tournament: Tournament, group: Group }) {
  const { loadStandings } = useContext(TournamentsContext)

  useEffect(() => {
    loadStandings(tournament.id, group.id)
  }, [])

  if (!group.standings) return <Loading />

  return <div><pre>{JSON.stringify(group.standings, null, 2) }</pre></div>

}