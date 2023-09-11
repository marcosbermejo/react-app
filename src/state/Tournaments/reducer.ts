import Group from "../../models/Group"
import Match from "../../models/Match"
import Tournament from "../../models/Tournament"

export interface State {
  tournaments: TournamentState[]
  loading: boolean
  loaded: boolean
  error: string
}

interface TournamentState {
  tournament: Tournament
  matchesState: MatchesState
  groupsState: GroupsState
}

interface MatchesState {
  matches: Match[],
  loading: boolean,
  loaded: boolean,
  error: string
}

interface GroupsState {
  groups: Group[],
  loading: boolean,
  loaded: boolean,
  error: string
}

type Action = 
  { type: 'SET_TOURNAMENTS_LOADING' } |
  { type: 'SET_TOURNAMENTS_ERROR', error: string } |
  { type: 'SET_TOURNAMENTS', tournaments: Tournament[] } | 
  { type: 'SET_MATCHES_LOADING', tournamentId: string } |
  { type: 'SET_MATCHES_ERROR', tournamentId: string, error: string } |
  { type: 'SET_MATCHES', tournamentId: string, matches: Match[] } |
  { type: 'SET_GROUPS_LOADING', tournamentId: string } |
  { type: 'SET_GROUPS_ERROR', tournamentId: string, error: string } |
  { type: 'SET_GROUPS', tournamentId: string, groups: Group[] }  


const setTournamentsLoading = (state: State): State => (
  { tournaments: state.tournaments, loaded: false, loading: true, error: '' }
)

const setTournamentsError = (state: State, error: string): State => (
  { tournaments: state.tournaments, loaded: false, loading: false, error }
)

const setTournaments = (tournaments: Tournament[]): State => {
  const tournamentsState  = tournaments.map(tournament => ({
    tournament,
    matchesState: { matches: [], loading: false, loaded: false, error: '' },
    groupsState: { groups: [], loading: false, loaded: false, error: '' }
  }))

  return { loaded: true, loading: false, error: '', tournaments: tournamentsState }
}

const updateTournamentState = (state: State, tournamentId: string, data: Partial<TournamentState>): State => {
  const tournaments = state.tournaments.map(tournamentState => (   
    tournamentState.tournament.id === tournamentId
      ? {...tournamentState, data}
      : tournamentState
  ))
  return { ...state, tournaments }
}

export default function reducer (state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOURNAMENTS_LOADING': 
      return setTournamentsLoading(state);

    case 'SET_TOURNAMENTS_ERROR':
      return setTournamentsError(state, action.error);

    case 'SET_TOURNAMENTS':
      return setTournaments(action.tournaments)

    case 'SET_MATCHES_LOADING': 
      return updateTournamentState(state, action.tournamentId, {matchesState: { matches: [], loaded: false, loading: true, error: '' }})

    case 'SET_MATCHES_ERROR': 
      return updateTournamentState(state, action.tournamentId, {matchesState: { matches: [], loaded: false, loading: false, error: action.error }})

    case 'SET_MATCHES': 
      return updateTournamentState(state, action.tournamentId, {matchesState: { matches: action.matches, loaded: true, loading: false, error: '' }})

    case 'SET_GROUPS_LOADING': 
      return updateTournamentState(state, action.tournamentId, {groupsState: { groups: [], loaded: false, loading: true, error: '' }})

    case 'SET_GROUPS_ERROR': 
      return updateTournamentState(state, action.tournamentId, {groupsState: { groups: [], loaded: false, loading: false, error: action.error }})

    case 'SET_GROUPS': 
      return updateTournamentState(state, action.tournamentId, {groupsState: { groups: action.groups, loaded: true, loading: false, error: '' }})

    default:
      return state;
  }
};