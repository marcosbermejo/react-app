import Club from '../models/Club'
import { ClubsResponse } from '../services/ApiResponse'

export default class ClubsMapper {

  private readonly data: ClubsResponse

  constructor(data: ClubsResponse) {
    this.data = data
  }

  /**
   * Maps from API response to Groups list
   */
  public mapClub(clubId: string): Club {
    const club: Club = {
      id: clubId,
      image: '',
      name: this.data.find(row => row.label === 'Nom')?.value ?? '',
      phone: this.data.find(row => row.label === 'Telèfon')?.value,
      email: this.data.find(row => row.label === 'Email')?.value,
      address: this.data.find(row => row.label === 'Direcció')?.value,
      postalCode: this.data.find(row => row.label === 'Codi postal')?.value,
      city: this.data.find(row => row.label === 'Municipi')?.value,
      province: this.data.find(row => row.label === 'Província')?.value,
      president: this.data.find(row => row.label === 'President')?.value,
    }
    return club
  }
}
