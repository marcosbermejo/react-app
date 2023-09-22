import { useReducer } from "react";
import { Fetcher } from "../../services/api";

export interface ResourcesState<T> {
  [id: string]: {
    resources: T[];
    loading: boolean;
    loaded: boolean;
    error: string;
    hasPrev: boolean;
    hasNext: boolean;
    loadedPages: number[];
  };
}

type Id = { id: string }

type Action<T extends Id> =
  { type: 'SET_RESOURCES_LOADING', id: string } |
  { type: 'SET_RESOURCES_ERROR', id: string, error: string } |
  { type: 'SET_RESOURCES', id: string, resources: T[], hasNext: boolean, hasPrev: boolean, loadedPage: number } |
  { type: 'SET_RESOURCE', id: string, resource?: T }

function reducer<T extends Id>(state: ResourcesState<T>, action: Action<T>): ResourcesState<T> {
  switch (action.type) {

    case 'SET_RESOURCES_LOADING':
      return { ...state, [action.id]: { ...state[action.id], resources: state[action.id]?.resources ?? [], loaded: false, loading: true, error: '' } }

    case 'SET_RESOURCES_ERROR':
      return { ...state, [action.id]: { ...state[action.id], resources: state[action.id]?.resources ?? [], loaded: false, loading: false, error: action.error } }

    case 'SET_RESOURCES':
      return {
        ...state,
        [action.id]: {
          resources: [...state[action.id].resources ?? [], ...action.resources],
          loaded: true,
          loading: false,
          error: '',
          hasNext: action.hasNext,
          hasPrev: action.hasPrev,
          loadedPages: [...state[action.id].loadedPages ?? [], action.loadedPage]
        }
      }

    case 'SET_RESOURCE':

      console.log(action)

      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          resources: state[action.id].resources.map(r => r.id === action.resource?.id ? action.resource : r),
          loaded: true,
          loading: false,
          error: ''
        }
      }


    default:
      return state;
  }
}

export default function useResources<T extends Id>(fetcher: Fetcher<T>) {
  const [state, dispatch] = useReducer(reducer<T>, {});

  const loadResources = async (id: string, page: number = 1, ...args: any[]) => {
    const resourcesState = state[id]
    if (resourcesState && (resourcesState.loadedPages?.includes(page) || resourcesState.loading)) return;

    try {
      if (page === 1) dispatch({ type: 'SET_RESOURCES_LOADING', id });
      const { resources, hasNext, hasPrev, loadedPage } = await fetcher.fetchAll(id, page, ...args)
      dispatch({ type: 'SET_RESOURCES', id, resources, hasNext, hasPrev, loadedPage });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_RESOURCES_ERROR', id, error: err.message });
    }
  }

  const loadResource = async (id: string, resourceId: string) => {
    const resourcesState = state[id]
    if (resourcesState && (resourcesState.loaded || resourcesState.loading)) return;

    try {
      dispatch({ type: 'SET_RESOURCES_LOADING', id });
      dispatch({ type: 'SET_RESOURCE', id, resource: await fetcher.fetchOne(resourceId) });

    } catch (err: any) {
      console.log(err)
      dispatch({ type: 'SET_RESOURCES_ERROR', id, error: err.message });
    }
  }

  return {
    resourcesState: state,
    loadResources,
    loadResource
  }
}