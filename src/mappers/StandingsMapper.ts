import Standing from '../models/Standing'
import { ApiStandingsResponse, StatsType } from '../services/ApiResponse'

export default class StandingsMapper {

  private readonly data: ApiStandingsResponse

  constructor(data: ApiStandingsResponse) {
    this.data = data
  }

  /**
   * Maps from API response to Groups list
   */
  public mapStandings(): Standing[] {
    return this.data.meta.standingsrows.map((row): Standing => ({
      id: row.id,
      name: row.name,
      position: row.position,
      score: this.findStat(row.standingsstats, 'score'),
      played_matches: this.findStat(row.standingsstats, 'played_matches'),
      won_matches: this.findStat(row.standingsstats, 'won_matches'),
      drawn_matches: this.findStat(row.standingsstats, 'drawn_matches'),
      lost_matches: this.findStat(row.standingsstats, 'lost_matches'),
      value: this.findStat(row.standingsstats, 'value'),
      value_against: this.findStat(row.standingsstats, 'value_against'),
      value_difference: this.findStat(row.standingsstats, 'value_difference'),
    }))
  }

  private findStat(stats: { type: StatsType, value: number }[], name: string): number {
    return stats.find(s => s.type === name)?.value ?? 0
  }

}








