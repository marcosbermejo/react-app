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
import ClubsMapper, { clubIdTranslations } from "../mappers/ClubsMapper";
import { format } from "date-fns";

const baseURL = process.env.REACT_APP_API_URL
const scrURL = process.env.REACT_APP_SCR_URL

const seasonId = '6653'
const manager1 = '210453'
const manager2 = '314965'

export type Paginated<T> = { hasNext: boolean, hasPrev: boolean, resources: T[], loadedPage: number }

export interface Fetcher<T> {
  fetchAll: (id: string, page?: number, ...args: any[]) => Promise<Paginated<T>>
  fetchOne: (id: string) => Promise<T>
}

export class TournamentsFetcher {

  async fetchAll(): Promise<Tournament[]> {
    const include = 'category,teams.club,teams.club.delegation'

    const url = (managerId: string) => {
      const filter = `season.id:${seasonId},manager.id:${managerId}`
      return `${baseURL}/tournaments?filter=${filter}&sort=order&include=${include}&page[size]=100`
    }

    const { data: { data: data1, included: included1 } } = await axios.get<ApiListResponse>(url(manager1))
    const { data: { data: data2, included: included2 } } = await axios.get<ApiListResponse>(url(manager2))

    const mapper = new TournamentMapper({ data: data1.concat(data2), included: included1.concat(included2) })
    return mapper.mapTournaments()
  }

  async fetchFirstMatch(tournamentId: string): Promise<Match[]> {
    const filter = `round.group.tournament.id:${tournamentId},!datetime:null`
    const url = `${baseURL}/matches?filter=${filter}&sort=datetime&page[size]=1`
    const { data } = await axios.get<ApiListResponse>(url)
    const mapper = new MatchesMapper({ data: data.data, included: [] })
    return mapper.mapMatches()
  }

  async fetchLastMatch(tournamentId: string): Promise<Match[]> {
    const filter = `round.group.tournament.id:${tournamentId},!datetime:null`
    const url = `${baseURL}/matches?filter=${filter}&sort=-datetime&page[size]=1`
    const { data } = await axios.get<ApiListResponse>(url)
    const mapper = new MatchesMapper({ data: data.data, included: [] })
    return mapper.mapMatches()
  }
}

export class MatchesFetcher implements Fetcher<Match> {

  async fetchAll(groupId: string, page: number = 1, withDate: boolean) {
    const filter = `round.group.id:${groupId}${withDate ? ',!datetime:null' : ''}`
    const include = 'teams,round,facility,results,periods,periods.results, round.group.tournament'
    const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}&page[number]=${page}&page[size]=20`
    const { data } = await axios.get<ApiListResponse>(url)
    const { links } = data
    const mapper = new MatchesMapper(data)
    return { resources: mapper.mapMatches(), hasNext: Boolean(links?.next), hasPrev: Boolean(links?.prev), loadedPage: page }
  }

  async fetchOne(matchId: string) {
    const filter = `id:${matchId}`
    const include = 'teams,round,facility,results,periods,periods.results, round.group.tournament'
    const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}`
    const { data } = await axios.get<ApiListResponse>(url)
    const mapper = new MatchesMapper(data)
    const matches = mapper.mapMatches()
    if (matches.length === 0) throw Error(`Match ${matchId} not found`)
    return mapper.mapMatches()[0]
  }
}

export class ClubMatchesFetcher implements Fetcher<Match> {
  async fetchAll(clubId: string, page: number = 1, day: string = format(new Date(), 'yyyy-MM-dd')) {

    const url = (clubId: string) => {
      const filter = `datetime>${day},round.group.tournament.season.id:${seasonId},teams.club.id:${clubId}`
      const include = 'teams,round,round.group.tournament,facility,round.group.tournament.category'
      return `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}&page[number]=${page}&page[size]=50`
    }
    
    const { data } = await axios.get<ApiListResponse>(url(clubId))

    const [clubId2, value] = Object.entries(clubIdTranslations).find(([key, value]) => value === clubId) ?? []
    if (clubId2) {
      const { data: data2 } = await axios.get<ApiListResponse>(url(clubId2))
      data.data = data.data.concat(data2.data)
      data.included = data.included.concat(data2.included)
    }

    const mapper = new MatchesMapper(data)
    const matches = mapper.mapMatches().sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return -1
      if (!b.date) return 1
      return +a.date < +b.date ? -1 : 1
    } )
    
    return { resources: matches, hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(matchId: string) {
    const filter = `id:${matchId}`
    const include = 'teams,round,facility,results,periods,periods.results'
    const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}`
    const { data } = await axios.get<ApiListResponse>(url)
    const mapper = new MatchesMapper(data)
    const matches = mapper.mapMatches()
    if (matches.length === 0) throw Error(`Match ${matchId} not found`)
    return mapper.mapMatches()[0]
  }
}

export class RefereesFetcher implements Fetcher<Profile> {
  async fetchAll(matchId: string, page: number = 1) {
    const include = 'matchreferees.license.profile'
    const url = `${baseURL}/matches?filter=id:${matchId}&include=${include}`
    const { data } = await axios.get<ApiListResponse>(url)

    const mapper = new MatchesMapper(data)
    return { resources: mapper.mapMatchReferees(), hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(matchId: string) {
    return { id: '', name: '', image: '' }
  }
}

export class GroupsFetcher implements Fetcher<Group> {
  async fetchAll(tournamentId: string, page: number = 1) {
    const include = 'rounds,rounds.faceoffs,rounds.faceoffs.first_team,rounds.faceoffs.second_team'
    const url = `${baseURL}/groups?filter=tournament.id:${tournamentId}&sort=order&include=${include}&page[size]=100`
    const { data } = await axios.get<ApiListResponse>(url)

    const mapper = new GroupsMapper(data)
    return { resources: mapper.mapGroups(), hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(tournamentId: string) {
    return { id: '', name: '', standings: [], rounds: [] }
  }
}

export class StandingsFetcher implements Fetcher<Standing> {
  async fetchAll(groupId: string, page: number = 1) {
    const url = `${baseURL}/groups/${groupId}/standings`
    const { data } = await axios.get<ApiStandingsResponse>(url)

    const mapper = new StandingsMapper(data)
    return { resources: mapper.mapStandings(), hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(groupId: string) {
    return { id: '', name: '' }
  }
}

export class ScoringsFetcher implements Fetcher<Scoring>{
  async fetchAll(matchId: string, page: number = 1, tournamentId: string) {
    const { data } = await axios.get<LiveScoringResponse[]>(`${scrURL}/tournament/${tournamentId}/match/${matchId}`)
    return { resources: data as Scoring[], hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(matchId: string) {
    return { id: '' }
  }
}

export class ClubsFetcher {
  async fetchClub(clubId: string) {
    const { data } = await axios.get<ClubsResponse>(`${scrURL}/club/${clubId}`)
    const mapper = new ClubsMapper(data)
    return mapper.mapClub(clubId)
  }
}

