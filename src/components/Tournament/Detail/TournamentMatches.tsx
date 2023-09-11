import { useContext, useEffect, useState } from "react"
import { TournamentsContext } from "../../../contexts/Tournaments/TournamentsContext"
import Loading from "../../../layout/Loading"
import Match from "../../Match/Match"
import Group from "../../../models/Group"
import Tournament from "../../../models/Tournament"

export default function TournamentMatches({ tournament, group }: { tournament: Tournament, group: Group }) {
  const { loadMatches } = useContext(TournamentsContext)

  useEffect(() => {
    loadMatches(tournament.id)
  }, [])

  if (!tournament.matches) return <Loading />

  // const matches = tournament.matches.filter(match => match.round?.id === '17781290')
  // return <div><pre>{JSON.stringify(matches, null, 2) }</pre></div>

  return tournament.matches
    .filter(match => match.date)
    .filter(match => group.rounds.some(({ id }) => match.round?.id === id))
    .map(match => <Match match={match} />)
}
