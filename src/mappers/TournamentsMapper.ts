import { ApiResponseData, ApiListResponse } from '../services/ApiResponse'
import Tournament from '../models/Tournament'

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
      category: this.findCategory(relationships.category?.data?.id)
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

}
