import { ApiResponseData, ApiListResponse } from '../services/ApiResponse'
import Group from '../models/Group'
import Faceoff from '../models/Faceoff'
import Round from '../models/Round'
import { parse } from 'date-fns'
import Team from '../models/Team'
import { clubIdTranslations } from './ClubsMapper'

export default class GroupsMapper {

  private readonly data: ApiResponseData[]
  private readonly included: ApiResponseData[]

  constructor(response: ApiListResponse) {
    this.data = response.data
    this.included = response.included
  }

  /**
   * Maps from API response to Groups list
   */
  public mapGroups(): Group[] {
    return this.data.map(({ id, attributes }): Group => ({
      id,
      name: attributes.name,
      type: attributes.type,
      group: attributes.group,
      promote: attributes.promote,
      relegate: attributes.relegate,
      rounds: this.findRounds(id),
      standings: []
    }))
  }

  /**
   * Returns a list of Rounds for a given groupId
   */
  private findRounds(groupId: string): Round[] {
    const data = this.included.filter(entity => entity.type === 'round' && entity.relationships.group?.data?.id === groupId)
    return data.map(({ id, attributes, relationships }): Round => ({
      id,
      name: attributes.name,
      order: attributes.order,
      start_date: this.parseDate(attributes.start_date),
      end_date: this.parseDate(attributes.end_date),
      groupId: groupId,
      faceoffs: this.findFaceoffs(id)
    }))
  }

  /**
   * Returns a list of Faceoffs for a given roundId
   */
  private findFaceoffs(roundId: string): Faceoff[] {
    const data = this.included.filter(entity => entity.type === 'faceoff' && entity.relationships.round?.data?.id === roundId)
    return data.map(({ id, attributes, relationships }): Faceoff => ({
      id,
      firstText: attributes.first_text,
      secondText: attributes.second_text,
      winner: attributes.winner,
      firstTeam: this.findTeam(relationships.first_team.data?.id ?? ''),
      secondTeam: this.findTeam(relationships.second_team?.data?.id ?? ''),
      firstPreviousFaceoffId: relationships.first_previous_faceoff.data?.id,
      secondPreviousFaceoffId: relationships.second_previous_faceoff.data?.id,
    }))
  }

  /**
   * Finds a Team by id in this.included and returns a mapped Team object
   */
  private findTeam(teamId: string): Team | undefined {
    const data = this.included.find(entity => entity.type === 'team' && entity.id === teamId)

    let clubId = data?.relationships.club?.data?.id ?? ''
    clubId = clubIdTranslations[clubId] ?? clubId

    return data ? {
      id: data.id,
      name: data.attributes.name,
      image: data.relationships.club?.data?.id ? `${process.env.REACT_APP_CDN_URL}/logos/${clubId}.jpg` : ''
    } as Team : undefined
  }

  /**
  * Parses API Dates by manually set UTC (Z) in date
  */
  private parseDate(date: string): Date | undefined {
    if (!date) return undefined
    return parse(`${date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date());
  };
}
