import { parse } from 'date-fns'
import { ApiResponseData, ApiListResponse } from '../interfaces/ApiResponse'
import Tournament from '../interfaces/Tournament'
import Group from '../interfaces/Group'
import Round from '../interfaces/Round'

export default class TournamentMapper {

  private readonly data: ApiResponseData[]
  private readonly included: ApiResponseData[]

  constructor(response: ApiListResponse) {
    this.data = response.data
    this.included = response.included
  }

  /**
   * Maps from API response to Tournament list
   */
  public mapTournaments(): Tournament[] {
    return this.data
      .map(({ id, attributes, relationships }) => ({
        id: id,
        status: attributes.status,
        order: attributes.order,
        name: attributes.name,
        category: this.findCategory(relationships.category?.data?.id),
        groups: this.findGroups(id),
        matches: [],
      }))
  }

  /**
   * Finds a category by id in this.included and returns its name
   */
  private findCategory(categoryId?: string): string {
    if (!categoryId) return ''

    const data = this.included.find(entity => entity.type === 'category' && entity.id === categoryId)
    return data?.attributes.name ?? ''
  }

  /**
   * Finds all groups for a given tournamentId in this.included and returns a list of mapped Group object
   */
  private findGroups(tournamentId: string): Group[] {
    const data = this.included.filter(entity => entity.type === 'group' && entity.relationships.tournament?.data?.id === tournamentId)
    if (!data) return []

    return data.map(({ id, attributes }) => ({
      id: id,
      name: attributes.name,
      type: attributes.type,
      group: attributes.group,
      promote: attributes.promote,
      relegate: attributes.relegate,
      rounds: this.findRounds(id)
    }))
  }

  /**
   * Finds a Round by id in this.included and returns a mapped Round object
   */
  private findRounds(groupId: string): Round[] {
    const data = this.included.filter(entity => entity.type === 'round' && entity.relationships.group?.data?.id === groupId)
    if (!data) return []

    return data.map(({ id, attributes }) => ({
      id: id,
      name: attributes.name,
      start_date: this.parseDate(attributes.start_date),
      end_date: this.parseDate(attributes.end_date),
    }))
  }

  /**
   * Parses API Dates by manually set UTC (Z) in date
   */
  private parseDate(date: string): Date | undefined {
    if (!date) return undefined
    return parse(`${date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date());
  };
}
