import { useReducer } from "react";
import Group from "../../models/Group";
import axios from "axios";

export interface GroupsState {
  [tournamentId: string]: {
    groups: Group[];
    loading: boolean;
    loaded: boolean;
    error: string;
  };
}

type Action =
  { type: 'SET_GROUPS_LOADING', tournamentId: string } |
  { type: 'SET_GROUPS_ERROR', tournamentId: string, error: string } |
  { type: 'SET_GROUPS', tournamentId: string, groups: Group[] }

function reducer(state: GroupsState, action: Action): GroupsState {
  switch (action.type) {

    case 'SET_GROUPS_LOADING':
      return {
        ...state,
        [action.tournamentId]: {
          ...state[action.tournamentId],
          groups: state[action.tournamentId]?.groups ?? [],
          loaded: false,
          loading: true,
          error: ''
        }
      }

    case 'SET_GROUPS_ERROR':
      return {
        ...state,
        [action.tournamentId]: {
          ...state[action.tournamentId],
          groups: state[action.tournamentId]?.groups ?? [],
          loaded: false,
          loading: false,
          error: action.error
        }
      }

    case 'SET_GROUPS':
      return {
        ...state,
        [action.tournamentId]: {
          groups: [...state[action.tournamentId].groups ?? [], ...action.groups],
          loaded: true,
          loading: false,
          error: ''
        }
      }

    default:
      return state;
  }
}

export default function useGroups() {
  const [state, dispatch] = useReducer(reducer, {});

  const loadGroups = async (tournamentId: string) => {
    const groupsState = state[tournamentId]
    if (groupsState && (groupsState.loaded || groupsState.loading)) return;

    try {
      dispatch({ type: 'SET_GROUPS_LOADING', tournamentId });
      const { data: groups } = await axios.get<Group[]>(`${process.env.REACT_APP_NEW_API_URL}/tournaments/${tournamentId}/groups`)
      dispatch({ type: 'SET_GROUPS', tournamentId, groups });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_GROUPS_ERROR', tournamentId, error: err.message });
    }
  }

  return {
    groupsState: state,
    loadGroups
  }
}