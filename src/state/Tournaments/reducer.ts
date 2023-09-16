import Group from "../../models/Group"
import Match from "../../models/Match"
import Profile from "../../models/Profile"
import Scoring from "../../models/Scoring"
import Standing from "../../models/Standing"
import Tournament from "../../models/Tournament"

interface Loadable {
  loading: boolean
  loaded: boolean
  error: string
}

export interface TournamentsState extends Loadable {
  tournaments: TournamentState[]
}

interface TournamentState extends Loadable {
  tournament: Tournament
  matchesState: MatchesState
  groupsState: GroupsState
}

interface MatchesState extends Loadable {
  matches: MatchState[],
}

interface MatchState {
  match: Match,
  scoringsState: ScoringsState
  refereesState: RefereesState
}

interface ScoringsState extends Loadable {
  scorings: Scoring[]
}

interface RefereesState extends Loadable {
  referees: Profile[]
}

interface GroupsState extends Loadable {
  groups: GroupState[],
}

interface GroupState {
  group: Group
  standingsState: StandingsState
}

interface StandingsState extends Loadable {
  standings: Standing[];
}

type Action =
  { type: 'SET_TOURNAMENTS_LOADING' } |
  { type: 'SET_TOURNAMENTS_ERROR', error: string } |
  { type: 'SET_TOURNAMENTS', tournaments: Tournament[] } |

  { type: 'SET_TOURNAMENT_LOADING', tournamentId: string } |
  { type: 'SET_TOURNAMENT_ERROR', tournamentId: string, error: string } |
  { type: 'SET_TOURNAMENT_DATES', tournamentId: string, start?: Date, end?: Date } |

  { type: 'SET_MATCHES_LOADING', tournamentId: string } |
  { type: 'SET_MATCHES_ERROR', tournamentId: string, error: string } |
  { type: 'SET_MATCHES', tournamentId: string, matches: Match[] } |

  { type: 'SET_GROUPS_LOADING', tournamentId: string } |
  { type: 'SET_GROUPS_ERROR', tournamentId: string, error: string } |
  { type: 'SET_GROUPS', tournamentId: string, groups: Group[] } |

  { type: 'SET_SCORINGS_LOADING', tournamentId: string, matchId: string } |
  { type: 'SET_SCORINGS_ERROR', tournamentId: string, matchId: string, error: string } |
  { type: 'SET_SCORINGS', tournamentId: string, matchId: string, scorings: Scoring[] } |

  { type: 'SET_REFEREES_LOADING', tournamentId: string, matchId: string } |
  { type: 'SET_REFEREES_ERROR', tournamentId: string, matchId: string, error: string } |
  { type: 'SET_REFEREES', tournamentId: string, matchId: string, referees: Profile[] } |

  { type: 'SET_STANDINGS_LOADING', tournamentId: string, groupId: string } |
  { type: 'SET_STANDINGS_ERROR', tournamentId: string, groupId: string, error: string } |
  { type: 'SET_STANDINGS', tournamentId: string, groupId: string, standings: Standing[] }


const setTournamentsLoading = (state: TournamentsState): TournamentsState => (
  { tournaments: state.tournaments, loaded: false, loading: true, error: '' }
)

const setTournamentsError = (state: TournamentsState, error: string): TournamentsState => (
  { tournaments: state.tournaments, loaded: false, loading: false, error }
)

const setTournaments = (tournaments: Tournament[]): TournamentsState => (
  {
    loaded: true,
    loading: false,
    error: '',
    tournaments: tournaments.map((tournament): TournamentState => ({
      tournament,
      loading: false,
      loaded: false,
      error: '',
      matchesState: { matches: [], loading: false, loaded: false, error: '' },
      groupsState: { groups: [], loading: false, loaded: false, error: '' }
    }))
  }
)

const updateTournamentDates = (state: TournamentsState, tournamentId: string, start?: Date, end?: Date): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, loaded: true, loading: false, error: '', tournament: { ...tournamentState.tournament, start, end } }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateTournamentState = (state: TournamentsState, tournamentId: string, data: Partial<TournamentState>): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, ...data }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateMatchesState = (state: TournamentsState, tournamentId: string, data: Partial<TournamentState>): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, matchesState: { ...tournamentState.matchesState, ...data } }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateGroupsState = (state: TournamentsState, tournamentId: string, data: Partial<TournamentState>): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? { ...tournamentState, groupsState: { ...tournamentState.groupsState, ...data } }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateMatchState = (state: TournamentsState, tournamentId: string, matchId: string, data: Partial<MatchState>): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? {
          ...tournamentState,
          matchesState: {
            ...tournamentState.matchesState,
            matches: tournamentState.matchesState.matches.map((matchState): MatchState => (
              matchState.match.id === matchId
              ? { ...matchState, ...data }
              : matchState
            ))
          }
        }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const updateGroupState = (state: TournamentsState, tournamentId: string, groupId: string, data: Partial<GroupState>): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? {
          ...tournamentState,
          groupsState: {
            ...tournamentState.groupsState,
            groups: tournamentState.groupsState.groups.map((groupState): GroupState => (
              groupState.group.id === groupId
              ? { ...groupState, ...data }
              : groupState
            ))
          }
        }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const setMatches = (state: TournamentsState, tournamentId: string, matches: Match[]): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? {
          ...tournamentState,
          matchesState: {
            loaded: true,
            loading: false,
            error: '',
            matches: matches.map((match): MatchState => ({
              match,
              scoringsState: { loaded: false, loading: false, error: '', scorings: [] },
              refereesState: { loaded: false, loading: false, error: '', referees: [] }
          }))}
        }
      : tournamentState
  ))
  return { ...state, tournaments }
}

const setGroups = (state: TournamentsState, tournamentId: string, groups: Group[]): TournamentsState => {
  const tournaments = state.tournaments.map((tournamentState): TournamentState => (
    tournamentState.tournament.id === tournamentId
      ? {
          ...tournamentState,
          groupsState: {
            loaded: true,
            loading: false,
            error: '',
            groups: groups.map((group): GroupState => ({
              group,
              standingsState: { loaded: false, loading: false, error: '', standings: [] }
          }))}
        }
      : tournamentState
  ))
  return { ...state, tournaments }
}


export default function reducer(state: TournamentsState, action: Action): TournamentsState {
  switch (action.type) {

    case 'SET_TOURNAMENTS_LOADING':
      return setTournamentsLoading(state);

    case 'SET_TOURNAMENTS_ERROR':
      return setTournamentsError(state, action.error);

    case 'SET_TOURNAMENTS':
      return setTournaments(action.tournaments)

    case 'SET_TOURNAMENT_LOADING':
      return updateTournamentState(state, action.tournamentId, { loaded: false, loading: true, error: ''})

    case 'SET_TOURNAMENT_ERROR':
      return updateTournamentState(state, action.tournamentId, { loaded: false, loading: false, error: action.error })

    case 'SET_TOURNAMENT_DATES':
      return updateTournamentDates(state, action.tournamentId, action.start, action.end)

    case 'SET_MATCHES_LOADING':
      return updateMatchesState(state, action.tournamentId, { loaded: false, loading: true, error: ''})

    case 'SET_MATCHES_ERROR':
      return updateMatchesState(state, action.tournamentId, { loaded: false, loading: false, error: action.error})

    case 'SET_MATCHES':
      return setMatches(state, action.tournamentId, action.matches)

    case 'SET_GROUPS_LOADING':
      return updateGroupsState(state, action.tournamentId, { loaded: false, loading: true, error: '' })

    case 'SET_GROUPS_ERROR':
      return updateGroupsState(state, action.tournamentId, { loaded: false, loading: false, error: action.error })

    case 'SET_GROUPS':
      return setGroups(state, action.tournamentId, action.groups)

    case 'SET_SCORINGS_LOADING':
      return updateMatchState(state, action.tournamentId, action.matchId, { scoringsState: { loaded: false, loading: true, error: '', scorings: []}})

    case 'SET_SCORINGS_ERROR':
      return updateMatchState(state, action.tournamentId, action.matchId, { scoringsState: { loaded: false, loading: false, error: action.error, scorings: []}})

    case 'SET_SCORINGS':
      return updateMatchState(state, action.tournamentId, action.matchId, { scoringsState: { loaded: true, loading: false, error: '', scorings: action.scorings}})

    case 'SET_REFEREES_LOADING':
      return updateMatchState(state, action.tournamentId, action.matchId, { refereesState: { loaded: false, loading: true, error: '', referees: []}})

    case 'SET_REFEREES_ERROR':
      return updateMatchState(state, action.tournamentId, action.matchId, { refereesState: { loaded: false, loading: false, error: action.error, referees: []}})

    case 'SET_REFEREES':
      return updateMatchState(state, action.tournamentId, action.matchId, { refereesState: { loaded: true, loading: false, error: '', referees: action.referees}})

    case 'SET_STANDINGS_LOADING':
      return updateGroupState(state, action.tournamentId, action.groupId, { standingsState: { loaded: false, loading: true, error: '', standings: []}})

    case 'SET_STANDINGS_ERROR':
      return updateGroupState(state, action.tournamentId, action.groupId, { standingsState: { loaded: false, loading: false, error: action.error, standings: []}})

    case 'SET_STANDINGS':
      return updateGroupState(state, action.tournamentId, action.groupId, { standingsState: { loaded: true, loading: false, error: '', standings: action.standings}})

    default:
      return state;
  }
};