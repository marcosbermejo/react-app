import { parse } from 'date-fns'
import { ApiResponseData, ApiListResponse } from '../interfaces/ApiResponse'
import Match from '../interfaces/Match'
import Team from '../interfaces/Team'
import Round from '../interfaces/Round'

export default class MatchesMapper {

  private readonly data: ApiResponseData[]
  private readonly included: ApiResponseData[]

  constructor(response: ApiListResponse) {
    this.data = response.data
    this.included = response.included
  }

  /**
   * Maps from API response to Match list
   */
  public mapMatches(): Match[] {
    return this.data.map(({ id, attributes, meta, relationships }) => ({
      id: id,
      finished: attributes.finished,
      round: this.findRound(relationships.round?.data?.id),
      facility: this.findFacility(relationships.facility?.data?.id),
      date: parse(`${attributes.date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date()),
      homeTeam: this.findTeam(meta.home_team),
      awayTeam: this.findTeam(meta.away_team),
      results: this.findResults(id)
    }))
  }

  private findResults(matchId: string) {
    const data = this.included.filter(entity => entity.type === 'result' && entity.relationships?.match?.data?.id === matchId)
    if (!data) return []

    return data.map(({ id, attributes, relationships }) => ({
      id: id,
      score: attributes.score,
      value: attributes.value,
      team: this.findTeam(relationships.team?.data?.id ?? '')
    }))
  }

  /**
   * Finds a Team by id in this.included and returns a mapped Team object
   */
  private findTeam(teamId: string): Team | undefined {
    const data = this.included.find(entity => entity.type === 'team' && entity.id === teamId)
    return data ? {
      id: data.id,
      name: data.attributes.name,
      image: data.meta.avatar.large
    } as Team : undefined
  }

  /**
   * Finds a Round by id in this.included and returns a mapped Round object
   */
  private findRound(roundId?: string): Round | undefined {
    if (!roundId) return undefined;

    const data = this.included.find(entity => entity.type === 'round' && entity.id === roundId)
    return data ? {
      id: data.id,
      name: data.attributes.name,
      start_date: this.parseDate(data.attributes.start_date),
      end_date: this.parseDate(data.attributes.end_date),
    } as Round : undefined
  }

  /**
   * Finds a facility by id in this.included and returns its name
   */
  private findFacility(facilityId?: string): string {
    if (!facilityId) return '';

    const data = this.included.find(entity => entity.type === 'facility' && entity.id === facilityId)
    return data?.attributes.name ?? ''
  }

   /**
   * Parses API Dates by manually set UTC (Z) in date
   */
    private parseDate(date: string): Date | undefined {
      if (!date) return undefined
      return parse(`${date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date());
    };
}
