import { useReducer } from "react"
import Tournament from "../../models/Tournament"
import { fetchFirstMatch, fetchLastMatch, fetchTournaments } from "../../services/api"

export interface TournamentsState {
  tournamentStates: TournamentState[]
  loading: boolean;
  loaded: boolean;
  error: string;
}

export interface TournamentState {
  tournament: Tournament;
  loading: boolean;
  loaded: boolean;
  error: string;
}

type Action =
  { type: 'SET_TOURNAMENTS_LOADING' } |
  { type: 'SET_TOURNAMENTS_ERROR', error: string } |
  { type: 'SET_TOURNAMENTS', tournaments: Tournament[] } |
  { type: 'SET_TOURNAMENT_LOADING', tournamentId: string } |
  { type: 'SET_TOURNAMENT_ERROR', tournamentId: string, error: string } |
  { type: 'SET_TOURNAMENT_DATES', tournamentId: string, start?: Date, end?: Date }

function setTournaments(list: Tournament[]): TournamentsState {
  return {
    tournamentStates: list.map(tournament => ({ tournament, loading: false, loaded: false, error: '' })),
    loaded: true,
    loading: false,
    error: ''
  };
}

function updateTournamentState(state: TournamentsState, tournamentId: string, data: Partial<TournamentState>): TournamentsState {
  return {
    ...state,
    tournamentStates: state.tournamentStates.map((tournamentState): TournamentState => (
      tournamentState.tournament.id === tournamentId
        ? { ...tournamentState, ...data }
        : tournamentState
    ))
  };
}

function updateTournamentDates(state: TournamentsState, tournamentId: string, start?: Date, end?: Date) {
  return {
    ...state,
    tournamentStates: state.tournamentStates.map((tournamentState): TournamentState => (
      tournamentState.tournament.id === tournamentId
        ? { tournament: {...tournamentState.tournament, start, end }, loading: false, loaded: true, error: '' }
        : tournamentState
    ))
  };
}

function reducer(state: TournamentsState, action: Action): TournamentsState {
  switch (action.type) {

    case 'SET_TOURNAMENTS_LOADING':
      return {...state, loaded: false, loading: true, error: '' };

    case 'SET_TOURNAMENTS_ERROR':
      return {...state, loaded: false, loading: false, error: action.error };

    case 'SET_TOURNAMENTS':
      return setTournaments(action.tournaments)

    case 'SET_TOURNAMENT_LOADING':
      return updateTournamentState(state, action.tournamentId, { loaded: false, loading: true, error: '' });

    case 'SET_TOURNAMENT_ERROR':
      return updateTournamentState(state, action.tournamentId, { loaded: false, loading: false, error: action.error });

    case 'SET_TOURNAMENT_DATES':
      return updateTournamentDates(state, action.tournamentId, action.start, action.end)

    default:
      return state;
  }
};

export default function useTournaments() {
  const [state, dispatch] = useReducer(reducer, { tournamentStates: [], loaded: false, loading: false, error: '' });
  const { tournamentStates, loaded, loading } = state

  const loadTournaments = async () => {
    if (loaded || loading) return;

    try {
      dispatch({ type: 'SET_TOURNAMENTS_LOADING' });
      dispatch({ type: 'SET_TOURNAMENTS', tournaments: await fetchTournaments() });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_TOURNAMENTS_ERROR', error: err.message });
    }
  }

  const loadDates = async (tournamentId: string) => {
    if (!loaded) return;

    const tournamentState = tournamentStates.find(({tournament}) => tournament.id === tournamentId)
    if (!tournamentState || tournamentState.loading || tournamentState.loaded) return;

    try {
      dispatch({ type: 'SET_TOURNAMENT_LOADING', tournamentId });
      const firstMatch = (await fetchFirstMatch(tournamentId))[0]
      const lastMatch = (await fetchLastMatch(tournamentId))[0]
      dispatch({ type: 'SET_TOURNAMENT_DATES', tournamentId, start: firstMatch?.date, end: lastMatch?.date });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_TOURNAMENT_ERROR', tournamentId, error: err.message });
    }
  }

  return {
    tournamentsState: state,
    loadTournaments,
    loadDates
  }
}