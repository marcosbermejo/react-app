import { ApiResponseData, ApiListResponse } from '../services/ApiResponse'
import Tournament from '../models/Tournament'
import Team from '../models/Team'
import Club from '../models/Club'

export default class TournamentsMapper {

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
    return this.data.map(({ id, attributes, relationships }): Tournament => ({
      id: id,
      status: attributes.status,
      order: attributes.order,
      name: attributes.name,
      category: this.findCategory(relationships.category?.data?.id),
      teams: this.findTeams(id)
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

  private findTeams(tournamentId: string): Team[] {
    const data = this.included.filter(entity => (
      entity.type === 'team' && 
      entity.relationships.registrable?.data?.type === 'tournament' &&
      entity.relationships.registrable?.data?.id === tournamentId))

    return data.map(({ id, attributes, relationships }): Team => ({
      id: id,
      name: attributes.name,
      image: relationships.club?.data?.id ? `/${relationships.club.data.id}.jpg` : '',
      club: this.findClub(relationships.club?.data?.id)
    }))
  }

  private findClub(clubId?: string): Club | undefined {
    if (!clubId) return undefined;

    const data = this.included.find(entity => entity.type === 'club' && entity.id === clubId)
    return data ? {
      id: data.id,
      name: data.attributes.name,
      image: `/${data.id}.jpg`,
    } as Club : undefined
  }

}
