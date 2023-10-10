import { useContext, useEffect, useReducer } from "react"
import Club from "../../models/Club";
import { TournamentsContext } from "../Tournaments/context";
import Team from "../../models/Team";
import Tournament from "../../models/Tournament";

export interface ClubsState {
  clubStates: ClubState[]
  loading: boolean;
  loaded: boolean;
  error: string;
}

export interface ClubState {
  club: Club;
  loading: boolean;
  loaded: boolean;
  error: string;
}

type Action =
  { type: 'SET_CLUBS_LOADING' } |
  { type: 'SET_CLUBS_ERROR', error: string } |
  { type: 'SET_CLUBS', clubs: Club[] } |
  { type: 'SET_CLUB_LOADING', clubId: string } |
  { type: 'SET_CLUB_ERROR', clubId: string, error: string } |
  { type: 'SET_CLUB', clubId: string, club: Club }

function setClubs(list: Club[]): ClubsState {
  return {
    clubStates: list.map(club => ({ club, loading: false, loaded: false, error: '' })),
    loaded: true,
    loading: false,
    error: ''
  };
}

function updateClubState(state: ClubsState, clubId: string, data: Partial<ClubState>): ClubsState {
  return {
    ...state,
    clubStates: state.clubStates.map((clubState): ClubState => (
      clubState.club.id === clubId
        ? { ...clubState, ...data }
        : clubState
    ))
  };
}

function updateClubData(state: ClubsState, clubId: string, data: Partial<Club>): ClubsState {
  return {
    ...state,
    clubStates: state.clubStates.map((clubState): ClubState => (
      clubState.club.id === clubId
        ? { ...clubState, loaded: true, loading: false, error: '', club: {...clubState.club, ...data} }
        : clubState
    ))
  };
}

function reducer(state: ClubsState, action: Action): ClubsState {
  switch (action.type) {

    case 'SET_CLUBS_LOADING':
      return {...state, loaded: false, loading: true, error: '' };

    case 'SET_CLUBS_ERROR':
      return {...state, loaded: false, loading: false, error: action.error };

    case 'SET_CLUBS':
      return setClubs(action.clubs)

    case 'SET_CLUB_LOADING':
      return updateClubState(state, action.clubId, { loaded: false, loading: true, error: '' });

    case 'SET_CLUB_ERROR':
      return updateClubState(state, action.clubId, { loaded: false, loading: false, error: action.error });

    case 'SET_CLUB':
      return updateClubData(state, action.clubId, action.club)

    default:
      return state;
  }
};

const teamsReducer = (clubs: Record<string, Club>, team: Team): Record<string, Club> => {
  if (!team.club) return clubs
  return { ...clubs, [team.club.id]: team.club }
}

const tournamentsReducer = (clubs: Record<string, Club>, tournament: Tournament): Record<string, Club> => ({
  ...clubs,
  ...tournament.teams.reduce(teamsReducer, {})
})

const clean = (name: string) => name
  .toLocaleLowerCase()
  .replaceAll(/[a-z]\./gm, '')
  .replace("d'", '')
  .replace("l'", '')
  .trim()

export default function useClubs() {
  const { loadTournaments, tournamentsState } = useContext(TournamentsContext)
  const [clubsState, dispatch] = useReducer(reducer, { clubStates: [], loaded: false, loading: false, error: '' });

  useEffect(() => {
    const clubs = tournamentsState.tournamentStates
      .map(({tournament}) => tournament)
      .reduce(tournamentsReducer, {})

    const sortedClubs = Object.values(clubs).sort((a, b) => (
      clean(a.name).localeCompare(clean(b.name))
    ))
    
    dispatch({ type: 'SET_CLUBS', clubs: sortedClubs });

  }, [tournamentsState.tournamentStates])

  useEffect(() => {
    dispatch({ type: 'SET_CLUBS_ERROR', error: tournamentsState.error });
  }, [tournamentsState.error])

  const loadClubs = async () => {
    if (tournamentsState.loaded || tournamentsState.loading) return;

    try {
      dispatch({ type: 'SET_CLUBS_LOADING' });
      loadTournaments()

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_CLUBS_ERROR', error: err.message });
    }
  }

  const loadClub = async (clubId: string) => {
    if (!clubsState.loaded) return;

    const tournamentState = clubsState.clubStates.find(({club}) => club.id === clubId)
    if (!tournamentState || tournamentState.loading || tournamentState.loaded) return;

    try {
      dispatch({ type: 'SET_CLUB_LOADING', clubId });
      dispatch({ type: 'SET_CLUB', clubId, club: {id: '', name: '', image: ''} });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_CLUB_ERROR', clubId, error: err.message });
    }
  }

  return {
    clubsState,
    loadClubs,
    loadClub
  }
}