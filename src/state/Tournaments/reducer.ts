import Group from "../../models/Group"
import Match from "../../models/Match"
import Tournament from "../../models/Tournament"

interface Loadable {
  loading: boolean
  loaded: boolean
  error: string
}

export interface State extends Loadable {
  tournaments: TournamentState[]
}

interface TournamentState {
  tournament: Tournament
  matchesState: MatchesState
  groupsState: GroupsState
}

interface MatchesState extends Loadable {
  matches: MatchState[],
}

interface MatchState extends Loadable {
  match: Match
}

interface GroupsState extends Loadable {
  groups: Group[],
}

type Action =
  { type: 'SET_TOURNAMENTS_LOADING' } |
  { type: 'SET_TOURNAMENTS_ERROR', error: string } |
  { type: 'SET_TOURNAMENTS', tournaments: Tournament[] } |
  { type: 'SET_TOURNAMENT_DATES', tournamentId: string, start?: Date, end?: Date } |
  
  { type: 'SET_MATCHES_LOADING', tournamentId: string } |
  { type: 'SET_MATCHES_ERROR', tournamentId: string, error: string } |
  { type: 'SET_MATCHES', tournamentId: string, matches: Match[] } |
  { type: 'SET_GROUPS_LOADING', tournamentId: string } |
  { type: 'SET_GROUPS_ERROR', tournamentId: string, error: string } |
  { type: 'SET_GROUPS', tournamentId: string, groups: Group[] } |
  { type: 'SET_MATCH_LOADING', tournamentId: string, matchId: string } |
  { type: 'SET_MATCH_ERROR', tournamentId: string, matchId: string, error: string } |
  { type: 'SET_MATCH', tournamentId: string, matchId: string, match: Match }

const setTournamentsLoading = (state: State): State => (
  { tournaments: state.tournaments, loaded: false, loading: true, error: '' }
)

const setTournamentsError = (state: State, error: string): State => (
  { tournaments: state.tournaments, loaded: false, loading: false, error }
)

const setTournaments = (tournaments: Tournament[]): State => {
  const tournamentsState = tournaments.map((tournament): TournamentState => ({
    tournament,
    matchesState: { matches: [], loading: false, loaded: false, error: '' },
    groupsState: { groups: [], loading: false, loaded: false, error: '' }
  }))

  return { loaded: true, loading: false, error: '', tournaments: tournamentsState }
}

const updateTournamentData = (state: State, tournamentId: string, data: Partial<Tournament>): State => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, tournament: {...tournamentState.tournament, ...data} }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateTournamentState = (state: State, tournamentId: string, data: Partial<TournamentState>): State => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, ...data }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateMatchState = (state: State, tournamentId: string, matchId: string, data: Partial<MatchState>): State => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? {
        ...tournamentState,
        matchesState: {
          ...tournamentState.matchesState,
          matches: tournamentState.matchesState.matches.map((matchState): MatchState => (
            matchState.match.id === matchId
              ?  {...matchState, ...data }
              : matchState
          ))
        }
      }
      : tournamentState
  ))
  return { ...state, tournaments }
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOURNAMENTS_LOADING':
      return setTournamentsLoading(state);

    case 'SET_TOURNAMENTS_ERROR':
      return setTournamentsError(state, action.error);

    case 'SET_TOURNAMENTS':
      return setTournaments(action.tournaments)

    case 'SET_TOURNAMENT_DATES':
      return updateTournamentData(state, action.tournamentId, {
        start: action.start,
        end: action.end
      })

    case 'SET_GROUPS_LOADING':
      return updateTournamentState(state, action.tournamentId, {
        groupsState: { groups: [], loaded: false, loading: true, error: '' }
      })

    case 'SET_GROUPS_ERROR':
      return updateTournamentState(state, action.tournamentId, {
        groupsState: { groups: [], loaded: false, loading: false, error: action.error }
      })

    case 'SET_GROUPS':
      return updateTournamentState(state, action.tournamentId, {
        groupsState: { groups: action.groups, loaded: true, loading: false, error: '' }
      })

    case 'SET_MATCHES_LOADING':
      return updateTournamentState(state, action.tournamentId, {
        matchesState: { matches: [], loaded: false, loading: true, error: '' }
      })

    case 'SET_MATCHES_ERROR':
      return updateTournamentState(state, action.tournamentId, {
        matchesState: { matches: [], loaded: false, loading: false, error: action.error }
      })

    case 'SET_MATCHES':
      return updateTournamentState(state, action.tournamentId, {
        matchesState: {
          matches: action.matches.map((match): MatchState => ({ match, loaded: false, loading: false, error: '' })),
          loaded: true,
          loading: false,
          error: ''
        }
      })

    case 'SET_MATCH_LOADING':
      return updateMatchState(state, action.tournamentId, action.matchId, { loaded: false, loading: true, error: '' })

    case 'SET_MATCH_ERROR':
      return updateMatchState(state, action.tournamentId, action.matchId, { loaded: false, loading: false, error: action.error })

    case 'SET_MATCH':
      return updateMatchState(state, action.tournamentId, action.matchId, { loaded: true, loading: false, error: '', match: action.match })


    default:
      return state;
  }
};