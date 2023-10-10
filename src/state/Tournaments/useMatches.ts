import { useReducer } from "react";
import Match from "../../models/Match";
import axios from "axios";

type PaginatedMatches = { matches: Match[], hasNext: boolean, hasPrev: boolean }

export interface MatchesState {
  [groupId: string]: {
    matches: Match[];
    loading: boolean;
    loaded: boolean;
    error: string;
    hasPrev: boolean;
    hasNext: boolean;
    loadedPages: number[];
  };
}

type Action =
  { type: 'SET_MATCHES_LOADING', groupId: string } |
  { type: 'SET_MATCHES_ERROR', groupId: string, error: string } |
  { type: 'SET_MATCHES', groupId: string, matches: Match[], hasNext: boolean, hasPrev: boolean, loadedPage: number } |
  { type: 'SET_MATCH', groupId: string, match: Match }

function reducer (state: MatchesState, action: Action): MatchesState {
  switch (action.type) {

    case 'SET_MATCHES_LOADING':
      return { ...state, [action.groupId]: { ...state[action.groupId], matches: state[action.groupId]?.matches ?? [], loaded: false, loading: true, error: '' } }

    case 'SET_MATCHES_ERROR':
      return { ...state, [action.groupId]: { ...state[action.groupId], matches: state[action.groupId]?.matches ?? [], loaded: false, loading: false, error: action.error } }

    case 'SET_MATCHES':
      return {
        ...state,
        [action.groupId]: {
          matches: [...state[action.groupId].matches ?? [], ...action.matches],
          loaded: true,
          loading: false,
          error: '',
          hasNext: action.hasNext,
          hasPrev: action.hasPrev,
          loadedPages: [...state[action.groupId].loadedPages ?? [], action.loadedPage]
        }
      }

    case 'SET_MATCH':
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          matches: 
            state[action.groupId].matches.find(r => r.id === action.match?.id)
              ? state[action.groupId].matches.map(r => r.id === action.match?.id ? action.match : r) 
              : (action.match ? [action.match] : []),
          loaded: true,
          loading: false,
          error: ''
        }
      }


    default:
      return state;
  }
}

export default function useMatches () {
  const [state, dispatch] = useReducer(reducer, {});

  const loadMatches = async (groupId: string, page: number = 1) => {
    const matchesState = state[groupId]
    if (matchesState && (matchesState.loadedPages?.includes(page) || matchesState.loading)) return;

    try {
      if (page === 1) dispatch({ type: 'SET_MATCHES_LOADING', groupId });
      const { data: { matches, hasNext, hasPrev } } = await axios.get<PaginatedMatches>(`${process.env.REACT_APP_NEW_API_URL}/groups/${groupId}/matches?page=${page}`)
      matches.forEach(match => {
        if (match.date) match.date = new Date (match.date)
      })
      dispatch({ type: 'SET_MATCHES', groupId, matches, hasNext, hasPrev, loadedPage: page });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_MATCHES_ERROR', groupId, error: err.message });
    }
  }

  const loadMatch = async (groupId: string, matchId: string) => {
    const matchesState = state[groupId]
    if (matchesState && (matchesState.loaded || matchesState.loading)) return;

    try {
      dispatch({ type: 'SET_MATCHES_LOADING', groupId });
      const { data: match } = await axios.get<Match>(`${process.env.REACT_APP_NEW_API_URL}/matches/${matchId}`)
      if (match.date) match.date = new Date (match.date)
      dispatch({ type: 'SET_MATCH', groupId, match });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_MATCHES_ERROR', groupId, error: err.message });
    }
  }

  return {
    matchesState: state,
    loadMatches,
    loadMatch
  }
}