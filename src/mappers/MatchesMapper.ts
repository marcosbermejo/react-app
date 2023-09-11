import { parse } from 'date-fns'
import { ApiResponseData, ApiListResponse, ApiData } from '../models/ApiResponse'
import Match from '../models/Match'
import Team from '../models/Team'
import Round from '../models/Round'
import Period from '../models/Period'

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
    return this.data.map(({ id, attributes, meta, relationships }): Match => ({
      id,
      finished: attributes.finished,
      round: this.findRound(relationships.round?.data?.id),
      facility: this.findFacility(relationships.facility?.data?.id),
      date: this.parseDate(attributes.date),
      homeTeam: this.findTeam(meta.home_team),
      awayTeam: this.findTeam(meta.away_team),
      homeTeamResult: this.findMatchResult(id, meta.home_team),
      awayTeamResult: this.findMatchResult(id, meta.away_team),
      periods: relationships.periods?.data ? this.findPeriods(relationships.periods.data, id, meta.home_team, meta.away_team) : []
    }))
  }

  /**
   * Returns the Match Result for a given Team ID and Match ID
   */
  private findMatchResult(matchId: string, teamId: string): number {
    const data = this.included.find(entity => (
      entity.type === 'result' &&
      entity.relationships.parent?.data?.type === 'match' &&
      entity.relationships.parent?.data?.id === matchId &&
      entity.relationships.team?.data?.id === teamId
    ))

    return data ? data.attributes.value : 0
  }

  /**
   * Returns a list of Periods for a given data array
   */
  private findPeriods(data: ApiData[], matchId: string,  homeTeamId: string, awayTeamId: string) {
    const periods: Period[] = []

    data.forEach(({id}) => {
      const data = this.included.find(entity => entity.type === 'period' && entity.id === id)
      if (data) periods.push( {
        id: data.id,
        name: data.attributes.name,
        finished: data.attributes.finished,
        order: data.attributes.order,
        homeTeamResult: this.findPeriodResult(id, homeTeamId),
        awayTeamResult: this.findPeriodResult(id, awayTeamId)
      })
    })
    return periods
  }

  /**
   * Returns the Period Result for a given Period ID and Team ID
   */
  private findPeriodResult(periodId: string, teamId: string): number {
    const data = this.included.find(entity => (
      entity.type === 'result' &&
      entity.relationships.period?.data?.id === periodId &&
      entity.relationships.team?.data?.id === teamId
    ))

    return data ? data.attributes.value : 0
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
