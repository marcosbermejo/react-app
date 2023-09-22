import Club from '../models/Club'
import { ClubsResponse } from '../services/ApiResponse'

export const clubIdTranslations: Record<string, string> = {
  '4977195': '4979833',
  '4977307': '4979866',
  '4977185': '4979827',
  '4977194': '4979832',
  '4977218': '4979843',
  '4977216': '4979842',
  '4977223': '4979845',
  '4977205': '4979839',
  '4978708': '4980017',
  '4977186': '4979828',
  '4977233': '4979847',
  '4977221': '4979844',
  '4977253': '4979850',
  '4977191': '4979830',
  '4977193': '4979831',
  '4977252': '4979849',
  '4977516': '4979925',
  '4978706': '4980016',
  '4978719': '4980021'
}

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
      image: `${process.env.REACT_APP_CDN_URL}/logos/${clubId}.jpg`,
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
