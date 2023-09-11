import axios from "axios";
import { ApiListResponse } from "../models/ApiResponse";
import TournamentMapper from "../mappers/TournamentsMapper";
import Tournament from "../models/Tournament";
import MatchesMapper from "../mappers/MatchesMapper";
import Match from "../models/Match";
import Group from "../models/Group";
import GroupsMapper from "../mappers/GroupsMapper";

const baseURL = 'https://localhost:3000'
const seasonId = '6653'
const managerId = '314965'

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const filter = `season.id:${seasonId},manager.id:${managerId}`
  const include = 'category'
  const url = `${baseURL}/tournaments?filter=${filter}&sort=order&include=${include}&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new TournamentMapper(data)
  return mapper.mapTournaments()
}

export const fetchMatches = async (tournamentId: string): Promise<Match[]> => {
  const filter = `round.group.tournament.id:${tournamentId}`
  const include = 'teams,round,round.group,facility,faceoff,results,periods,matchreferees.license.profile,periods.results'
  const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)
  const mapper = new MatchesMapper(data)
  return mapper.mapMatches()
}

export const fetchGroups = async (tournamentId: string): Promise<Group[]> => {
  const url = `${baseURL}/groups?filter=tournament.id:${tournamentId}&sort=order&page[size]=100`
  const { data } = await axios.get<ApiListResponse>(url)

  const mapper = new GroupsMapper(data)
  return mapper.mapGroups()
}