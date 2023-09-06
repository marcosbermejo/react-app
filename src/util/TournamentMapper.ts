import { parse } from 'date-fns'
import { ApiResponseData, ApiResponse } from '../interfaces/ApiResponse'
import Group from '../interfaces/Group'
import Round from '../interfaces/Round'
import Tournament from '../interfaces/Tournament'
import Match from '../interfaces/Match'
import Team from '../interfaces/Team'

let cont = 0

export default class TournamentMapper {

  private readonly data: ApiResponseData[]
  private readonly included: ApiResponseData[]

  constructor(response: ApiResponse) {
    this.data = response.data
    this.included = response.included
  }

  /**
   * Maps from API response to Tournament list
   */
  public mapTournaments(): Tournament[] {
    return this.data
      .map(tournament => this.createTournament(tournament))
      .sort((a, b) => {
        if (a.nextMatch === null && b.nextMatch === null) return 0
        if (a.nextMatch?.date === null && b.nextMatch?.date === null) return 0
        if (a.nextMatch === null) return 1
        if (a.nextMatch?.date === null) return 1
        if (b.nextMatch === null) return -1
        if (b.nextMatch?.date === null) return -1
        return a.nextMatch.date.getTime() - b.nextMatch.date.getTime();
    });
  }

  /**
   * Maps from API object to Tournament
   */
  private createTournament({ id, attributes }: ApiResponseData): Tournament {
    const now = new Date()
    const matches: Match[] = []
    const tournament = {
      status: attributes.status,
      order: attributes.order,
      id: id,
      name: attributes.name,
      groups: this.findGroups(id).map(group => this.createGroup(group, matches))
    } as Tournament;

    matches.sort((a, b) => {
      if (a.date === null && b.date === null) return 0
      if (a.date === null) return 1
      if (b.date === null) return -1
      return a.date.getTime() - b.date.getTime();
    })

    tournament.nextMatch = matches.find(match =>  match.date && match.date > now) ?? null

    return tournament;
  }

  /**
   * Finds groups for a given tournamentId in `included` attribute
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
   * Finds rounds for a given groupId in `included` attribute
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
   * Finds matches for a given roundId in `included` attribute
   */
  private findMatches(roundId: string): ApiResponseData[] {
    return this.included
      .filter(entity => entity.type === 'match' && entity.relationships.round.data.id === roundId)
      .sort((a, b) => a.attributes.date?.localeCompare(b.attributes.date ?? ''))
  }

  /**
   * Maps from API object to Match
   */
  private createMatch({ id, attributes, meta }: ApiResponseData, matches: Match[]): Match {
    const match = {
      id: id,
      finished: attributes.finished,
      date: this.parseDate(attributes.date),
      homeTeam: this.findTeam(meta.home_team),
      awayTeam: this.findTeam(meta.away_team),
    }

    matches.push(match)
    return match;
  }

  /**
   * Finds a team by id in `included` attribute and returns a mapped Team object
   */
  private findTeam(teamId: string): Team | null {
    const data = this.included.find(entity => entity.type === 'team' && entity.id === teamId)
    return data ? this.createTeam(data) : null
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
   * Parses API Dates by manually set UTC (Z) in date
   */
  private parseDate(date: string): Date | null {
    if (!date) return null
    return parse(`${date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date());
  };

}
