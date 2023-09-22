import { ApiResponseData, ApiListResponse } from '../services/ApiResponse'
import Tournament from '../models/Tournament'
import Team from '../models/Team'
import Club from '../models/Club'
import Delegation from '../models/Delegation'
import { clubIdTranslations } from './ClubsMapper'

const categoryIdTranslations: Record<string, Record<string, string>> = {
  female: {'2090': '4815'},
  male: {'2090': '4814'},
}

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
      category: this.findCategory(attributes.gender, relationships.category?.data?.id ?? ''),
      teams: this.findTeams(id)
    }))
  }

  /**
   * Finds a category by id in this.included and returns its name
   */
  private findCategory(gender: string, categoryId?: string): string {
    if (!categoryId) return ''

    categoryId = categoryIdTranslations[gender]?.[categoryId] ?? categoryId

    const data = this.included.find(entity => entity.type === 'category' && entity.id === categoryId)
    return data?.attributes.name ?? ''
  }

  private findTeams(tournamentId: string): Team[] {
    const data = this.included.filter(entity => (
      entity.type === 'team' &&
      entity.relationships.registrable?.data?.type === 'tournament' &&
      entity.relationships.registrable?.data?.id === tournamentId))
    

    return data.map(({ id, attributes, relationships }): Team => {
      let clubId = relationships.club?.data?.id ?? ''
      clubId = clubIdTranslations[clubId] ?? clubId

      return {
        id: id,
        name: attributes.name,
        image: clubId ? `${process.env.REACT_APP_CDN_URL}/logos/${clubId}.jpg` : '',
        club: this.findClub(clubId)
      }
    })
  }

  private findClub(clubId?: string): Club | undefined {
    if (!clubId) return undefined;

    const data = this.included.find(entity => entity.type === 'club' && entity.id === clubId)
    return data ? {
      id: data.id,
      name: data.attributes.name,
      image: `${process.env.REACT_APP_CDN_URL}/logos/${data.id}.jpg`,
      delegation: this.findDelegation(data.relationships.delegation?.data?.id)
    } as Club : undefined
  }

  private findDelegation(delegationId?: string): Delegation | undefined {
    if (!delegationId) return undefined;

    const data = this.included.find(entity => entity.type === 'delegation' && entity.id === delegationId)
    return data ? {
      id: data.id,
      name: data.attributes.name,
    } as Delegation : undefined
  }

}
