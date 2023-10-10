import axios from "axios";
import { ApiListResponse, ApiStandingsResponse, LiveScoringResponse } from "./ApiResponse";
import Match from "../models/Match";
import Standing from "../models/Standing";
import StandingsMapper from "../mappers/StandingsMapper";
import Scoring from "../models/Scoring";
import { clubIdTranslations } from "../mappers/ClubsMapper";
import { format } from "date-fns";

const baseURL = process.env.REACT_APP_API_URL
const scrURL = process.env.REACT_APP_SCR_URL

const seasonId = '6653'

export type Paginated<T> = { hasNext: boolean, hasPrev: boolean, resources: T[], loadedPage: number }

export interface Fetcher<T> {
  fetchAll: (id: string, page?: number, ...args: any[]) => Promise<Paginated<T>>
  fetchOne: (id: string) => Promise<T>
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

    // const mapper = new MatchesMapper(data)
    // const matches = mapper.mapMatches().sort((a, b) => {
    //   if (!a.date && !b.date) return 0
    //   if (!a.date) return -1
    //   if (!b.date) return 1
    //   return +a.date < +b.date ? -1 : 1
    // } )
    
    return { resources: [], hasNext: false, hasPrev: false, loadedPage: page }
  }

  async fetchOne(matchId: string) {
    const filter = `id:${matchId}`
    const include = 'teams,round,facility,results,periods,periods.results'
    const url = `${baseURL}/matches?filter=${filter}&sort=datetime&include=${include}`
    const { data } = await axios.get<ApiListResponse>(url)
    // const mapper = new MatchesMapper(data)
    // const matches = mapper.mapMatches()
    // if (matches.length === 0) throw Error(`Match ${matchId} not found`)
    // return mapper.mapMatches()[0]

    return {} as Match
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
