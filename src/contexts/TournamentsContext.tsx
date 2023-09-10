import axios from "axios";
import { ReactNode, createContext, useState, useEffect, useReducer } from "react";
import Tournament from "../interfaces/Tournament";
import { ApiItemResponse, ApiListResponse } from "../interfaces/ApiResponse";
import TournamentMapper from "../util/TournamentMapper";
import MatchesMapper from "../util/MatchesMapper";
import Match from "../interfaces/Match";

const baseURL = 'https://localhost.com'

interface IContext {
  tournaments: StateTournament[]
  loading: boolean
  loaded: boolean
  error: string
  loadTournaments: () => void,
  loadMatches: (id: string) => void
}

export const TournamentsContext = createContext<IContext>({
  tournaments: [],
  loading: false,
  loaded: false,
  error: '',
  loadTournaments: () => {},
  loadMatches: () => {}
});

interface State {
  tournaments: StateTournament[]
  loading: boolean
  loaded: boolean
  error: string
}

interface StateTournament {
  tournament: Tournament
  loading: boolean
  loaded: boolean
  error: string
}

interface SetTournamentsLoadingAction { type: 'SET_TOURNAMENTS_LOADING' }
interface SetTournamentsErrorAction { type: 'SET_TOURNAMENTS_ERROR', error: string }

interface SetTournamentLoadingAction { type: 'SET_TOURNAMENT_LOADING', id: string }
interface SetTournamentErrorAction { type: 'SET_TOURNAMENT_ERROR', id: string, error: string }

interface SetTournamentsAction { type: 'SET_TOURNAMENTS', tournaments: Tournament[] }
interface SetMatchesAction { type: 'SET_MATCHES', id: string, matches: Match[] }

type Action = SetMatchesAction | SetTournamentsAction | 
  SetTournamentsLoadingAction | SetTournamentsErrorAction |
  SetTournamentLoadingAction | SetTournamentErrorAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TOURNAMENTS_LOADING': 
      return { ...state, loaded: false, loading: true, error: '' };

    case 'SET_TOURNAMENTS_ERROR':
      return { ...state, loaded: false, loading: false, error: action.error };

    case 'SET_TOURNAMENTS':
      return { ...state, loaded: true, loading: false, error: '', tournaments: action.tournaments.map(tournament => ({ tournament, loading: false, error: '', loaded: false }))};

    case 'SET_TOURNAMENT_LOADING': 
      return { ...state, tournaments: state.tournaments.map(stateTournament => (
        stateTournament.tournament.id === action.id
          ? { ...stateTournament, loaded: false, loading: true, error: '' }
          : stateTournament
      )) };

    case 'SET_TOURNAMENT_ERROR':
      return { ...state, tournaments: state.tournaments.map(stateTournament => (
        stateTournament.tournament.id === action.id
          ? { ...stateTournament, loaded: false, loading: false, error: action.error }
          : stateTournament
      )) };

    case 'SET_MATCHES':
      return { ...state, tournaments: state.tournaments.map(stateTournament => (
        stateTournament.tournament.id === action.id
          ? { ...stateTournament,  loaded: true, loading: false, error: '', tournament: { ...stateTournament.tournament, matches: action.matches } }
          : stateTournament
      )) };

      default:
      return state;
  }
};


export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tournaments: [], loaded: false, loading: false, error: '' });
  
  const loadTournaments = async () => {
    if (!state.loaded) {
      dispatch({ type: 'SET_TOURNAMENTS_LOADING' });

      try {
        const params= 'filter=season.id:6653,manager.id:314965&sort=order&include=category&page[size]=100'
        const { data } = await axios.get<ApiListResponse>(`${baseURL}/tournaments?${params}`)
        const mapper = new TournamentMapper(data)
        dispatch({ type: 'SET_TOURNAMENTS', tournaments: mapper.mapTournaments() });

      } catch (err: any) {
        console.log(err)
        dispatch({ type: 'SET_TOURNAMENTS_ERROR', error: err.message });
      }
    }
  }

  const loadMatches = async (id: string) => {
    if (state.loaded) {

      const { tournament, loaded } = state.tournaments.find(({tournament}) => tournament.id === id) ?? {}

      if (tournament && !loaded) {
        dispatch({ type: 'SET_TOURNAMENT_LOADING', id });

        try {
          const params= `filter=round.group.tournament.id:${id}&sort=datetime&include=teams,round,round.group,facility&page[size]=100`
          const { data: { data, included } } = await axios.get<ApiListResponse>(`${baseURL}/matches?${params}`)
          const mapper = new MatchesMapper({data, included })
          dispatch({ type: 'SET_MATCHES', id, matches: mapper.mapMatches() });        
 
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_TOURNAMENT_ERROR', id, error: err.message });
        }
      }
    }
  };

  return (
    <TournamentsContext.Provider value={{
      tournaments: state.tournaments,
      loading: state.loading,
      loaded: state.loaded,
      error: state.error,
      loadTournaments,
      loadMatches
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}