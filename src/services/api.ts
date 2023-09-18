import axios from "axios";
import { ApiListResponse, ApiStandingsResponse, ClubsResponse, LiveScoringResponse } from "./ApiResponse";
import TournamentMapper from "../mappers/TournamentsMapper";
import Tournament from "../models/Tournament";
import MatchesMapper from "../mappers/MatchesMapper";
import Match from "../models/Match";
import Group from "../models/Group";
import GroupsMapper from "../mappers/GroupsMapper";
import Standing from "../models/Standing";
import StandingsMapper from "../mappers/StandingsMapper";
import Profile from "../models/Profile";
import Scoring from "../models/Scoring";
import Club from "../models/Club";
import ClubsMapper from "../mappers/ClubsMapper";

const baseURL = process.env.REACT_APP_API_URL
const scrURL = process.env.REACT_APP_SCR_URL

const seasonId = '6653'
const managerId = '314965'

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const filter = `season.id:${seasonId},manager.id:${managerId}`
  const include = 'category,teams.club'
  const url = `${baseURL}/tournaments?filter=${filter}&sort=order&include=${include}&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new TournamentMapper(data)
  return mapper.mapTournaments()
}

export const fetchFirstMatch = async (tournamentId: string): Promise<Match[]> => {
  const filter = `round.group.tournament.id:${tournamentId},!datetime:null`
  const url = `${baseURL}/matches?filter=${filter}&sort=datetime&page[size]=1`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new MatchesMapper({data: data.data, included: []})
  return mapper.mapMatches()
}

export const fetchLastMatch = async (tournamentId: string): Promise<Match[]> => {
  const filter = `round.group.tournament.id:${tournamentId},!datetime:null`
  const url = `${baseURL}/matches?filter=${filter}&sort=-datetime&page[size]=1`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new MatchesMapper({data: data.data, included: []})
  return mapper.mapMatches()
}

export const fetchMatches = async (tournamentId: string): Promise<Match[]> => {
  const filter = `round.group.tournament.id:${tournamentId}`
  const include = 'teams,round,facility,results,periods,periods.results'
  const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new MatchesMapper(data)
  const matches = mapper.mapMatches()
  return matches.map((match): Match => ({ ...match, tournamentId }))
}

export const fetchReferees = async (matchId: string): Promise<Profile[]> => {
  const include = 'matchreferees.license.profile'
  const url = `${baseURL}/matches?filter=id:${matchId}&include=${include}`
  const { data } = await axios.get<ApiListResponse>(url)

  const mapper = new MatchesMapper(data)
  return mapper.mapMatchReferees()
}

export const fetchGroups = async (tournamentId: string): Promise<Group[]> => {
  const include = 'rounds,rounds.faceoffs,rounds.faceoffs.first_team,rounds.faceoffs.second_team'
  const url = `${baseURL}/groups?filter=tournament.id:${tournamentId}&sort=order&include=${include}&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)

  const mapper = new GroupsMapper(data)
  return mapper.mapGroups()
}

export const fetchStandings = async (groupId: string): Promise<Standing[]> => {
  const url = `${baseURL}/groups/${groupId}/standings`
  const { data } = await axios.get<ApiStandingsResponse>(url)

  const mapper = new StandingsMapper(data)
  return mapper.mapStandings()
}

export const fetchScorings = async (tournamentId: string, matchId: string): Promise<Scoring[]> => {
  const { data } = await axios.get<LiveScoringResponse[]>(`${scrURL}/tournament/${tournamentId}/match/${matchId}`)
  return data as Scoring[]
}

export const fetchClub = async (clubId: string): Promise<Club[]> => {
  const { data } = await axios.get<ClubsResponse>(`${scrURL}/club/${clubId}`)
  const mapper = new ClubsMapper(data)
  return [mapper.mapClub(clubId)]
}
