import { useReducer } from "react";

export interface ResourcesState<T> {
  [id: string]: {
    resources: T[];
    loading: boolean;
    loaded: boolean;
    error: string;
  };
}

type Action<T> =
  { type: 'SET_RESOURCES_LOADING', id: string } |
  { type: 'SET_RESOURCES_ERROR', id: string, error: string } |
  { type: 'SET_RESOURCES', id: string, resources: T[] }

function reducer<T>(state: ResourcesState<T>, action: Action<T>): ResourcesState<T> {
  switch (action.type) {

    case 'SET_RESOURCES_LOADING':
      return { ...state, [action.id]: { resources: [], loaded: false, loading: true, error: '' } }

    case 'SET_RESOURCES_ERROR':
      return { ...state, [action.id]: { resources: [], loaded: false, loading: false, error: action.error } }

    case 'SET_RESOURCES':
      return { ...state, [action.id]: { resources: action.resources, loaded: true, loading: false, error: '' } }

    default:
      return state;
  }
}

export default function useResources<T>(fetcher: (...args: string[]) => Promise<T[]>) {
  const [state, dispatch] = useReducer(reducer<T>, {});

  const loadResources = async (id: string, tournamentId?: string) => {
    const resourcesState = state[id]
    if (resourcesState && (resourcesState.loaded || resourcesState.loading)) return;

    try {
      dispatch({ type: 'SET_RESOURCES_LOADING', id });
      const resources = tournamentId ? await fetcher(tournamentId, id) : await fetcher(id)
      dispatch({ type: 'SET_RESOURCES', id, resources });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_RESOURCES_ERROR', id, error: err.message });
    }
  }

  return {
    resourcesState: state,
    loadResources
  }
}