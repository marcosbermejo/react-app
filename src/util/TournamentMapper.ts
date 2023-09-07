import { parse } from 'date-fns'
import { ApiResponseData, ApiListResponse } from '../interfaces/ApiResponse'
import Group from '../interfaces/Group'
import Round from '../interfaces/Round'
import Tournament from '../interfaces/Tournament'
import Match from '../interfaces/Match'
import Team from '../interfaces/Team'

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
      .sort((a, b) => a.attributes.order - b.attributes.order)
      .map(tournament => this.createTournament(tournament))
  }

  /**
   * Maps from API object to Tournament
   */
  private createTournament({ id, attributes, relationships }: ApiResponseData): Tournament {
    const now = new Date()
    const matches: Match[] = []

    const tournament = {
      status: attributes.status,
      order: attributes.order,
      id: id,
      name: attributes.name,
      category: this.findCategory(relationships?.category?.data?.id),
      groups: this.findGroups(id).map(group => this.createGroup(group, matches)),
      nextMatches: []
    } as Tournament;

    matches.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return a.date.getTime() - b.date.getTime();
    })

    tournament.nextMatches = matches.filter(match =>  match.date && match.date > now)

    return tournament;
  }

  /**
   * Finds a category by id in this.included and returns its name
   */
  private findCategory(categoryId: string): string {
    const data = this.included.find(entity => entity.type === 'category' && entity.id === categoryId)
    return data?.attributes.name ?? ''
  }

  /**
   * Finds groups for a given tournamentId in this.included
   */
  private findGroups(tournamentId: string): ApiResponseData[] {
    return this.included
      .filter(entity => entity.type === 'group' && entity.relationships.tournament.data.id === tournamentId)
      .sort((a, b) => a.attributes.order - b.attributes.order)
  }

  /**
   * Maps from API object to Group
   */
  private createGroup({ id, attributes }: ApiResponseData, matches: Match[]): Group {
    return {
      id: id,
      name: attributes.name,
      rounds: this.findRounds(id).map(round => this.createRound(round, matches))
    }
  }

  /**
   * Finds rounds for a given groupId in this.included
   */
  private findRounds(groupId: string): ApiResponseData[] {
    return this.included
      .filter(entity => entity.type === 'round' && entity.relationships.group.data.id === groupId)
      .sort((a, b) => a.attributes.order - b.attributes.order)
  }

  /**
   * Maps from API object to Ground
   */
  private createRound({ id, attributes }: ApiResponseData, matches: Match[]): Round {
    return {
      id: id,
      name: attributes.name,
      start_date: this.parseDate(attributes.start_date),
      end_date: this.parseDate(attributes.end_date),
      matches: this.findMatches(id).map(match => this.createMatch(match, matches))
    }
  }

  /**
   * Finds matches for a given roundId in this.included
   */
  private findMatches(roundId: string): ApiResponseData[] {
    return this.included
      .filter(entity => entity.type === 'match' && entity.relationships.round.data.id === roundId)
      .sort((a, b) => a.attributes.date?.localeCompare(b.attributes.date ?? ''))
  }

  /**
   * Maps from API object to Match
   */
  private createMatch({ id, attributes, meta, relationships }: ApiResponseData, matches: Match[]): Match {
    const match = {
      id: id,
      finished: attributes.finished,
      date: this.parseDate(attributes.date),
      homeTeam: this.findTeam(meta.home_team),
      awayTeam: this.findTeam(meta.away_team),
      facility: this.findFacility(relationships?.facility?.data?.id)
    }

    matches.push(match)
    return match;
  }

  /**
   * Finds a team by id in this.included and returns a mapped Team object
   */
  private findTeam(teamId: string): Team | undefined {
    const data = this.included.find(entity => entity.type === 'team' && entity.id === teamId)
    return data ? this.createTeam(data) : undefined
  }

  /**
   * Maps from API object to Match
   */
  private createTeam({ id, attributes, meta }: ApiResponseData): Team {
    return {
      id: id,
      name: attributes.name,
      image: meta.avatar.large
    }
  }
  
  /**
   * Finds a facility by id in this.included and returns its name
   */
  private findFacility(facilityId: string): string {
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
