import { ApiResponseData, ApiListResponse } from '../models/ApiResponse'
import Group from '../models/Group'

export default class GroupsMapper {

  private readonly data: ApiResponseData[]

  constructor(response: ApiListResponse) {
    this.data = response.data
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
      standings: []
    }))
  }

}
