import axios from "axios";
import { ReactNode, createContext, useState, useEffect, useReducer } from "react";
import Tournament from "../interfaces/Tournament";
import { ApiItemResponse, ApiListResponse } from "../interfaces/ApiResponse";
import TournamentMapper from "../util/TournamentMapper";

interface IContext {
  tournaments?: Tournament[],
  error?: string,
  loadedTournaments: string[],
  loadTournaments: () => void,
  loadTournament: (id: string) => void
}

export const TournamentsContext = createContext<IContext>({
  loadedTournaments: [],
  loadTournaments: () => {},
  loadTournament: () => {}
});

interface AppState {
  tournaments?: Tournament[];
}

interface Action {
  type: 'UPDATE_TOURNAMENT' | 'SET_TOURNAMENTS';
  payload: {
    id?: string;
    tournament?: Tournament;
    tournaments?: Tournament[];
  };
}


const reducer = (state: AppState, action: Action): AppState => {

  switch (action.type) {
    case 'UPDATE_TOURNAMENT':
      if (!action.payload.tournament) return state
      if (!state.tournaments) return { tournaments: [action.payload.tournament]}

      return {
        ...state,
        tournaments: 
          state.tournaments.map(tournament => 
            tournament.id === action.payload.id
              ? { ...tournament, ...action.payload.tournament }
              : tournament
          ) };

    case 'SET_TOURNAMENTS':
      return {
        ...state,
        tournaments: action.payload.tournaments?.map(tournament => 
          state.tournaments?.find(t => t.id === tournament.id) ?? tournament
        )
      };

    default:
      return state;
  }
};


export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(false);

  const [loadingTournaments, setLoadingTournaments] = useState<string[]>([]);
  const [loadedTournaments, setLoadedTournaments] = useState<string[]>([]);

  const [state, dispatch] = useReducer(reducer, {});
  const [error, setError] = useState<string | undefined>();

  const loadTournaments = () => {
    if (!isListLoading && !isListLoaded) {

      setIsListLoading(true)

      axios
        .get<ApiListResponse>('http://localhost:3000')
        .then(({ data }) => {
          const mapper = new TournamentMapper(data)
          dispatch({ type: 'SET_TOURNAMENTS', payload: { tournaments: mapper.mapTournaments() } });
          setError(undefined)
        })
        .catch(error => {
          setError(error.message)
        }).finally(() => {
          setIsListLoaded(true)
          setIsListLoading(false)
        })
    }
  }

  const loadTournament = (id: string) => {
    if (!loadedTournaments.includes(id) && !loadingTournaments.includes(id) ) {

      setLoadingTournaments(list => [...list, id])

      axios
      .get<ApiItemResponse>(`http://localhost:3000`)
      .then(response => {
        const mapper = new TournamentMapper({data: [response.data.data], included: response.data.included})
        const mappedTournament = mapper.mapTournaments()[0]
        dispatch({ type: 'UPDATE_TOURNAMENT', payload: { id, tournament: mappedTournament } });

        setLoadingTournaments(list => list.filter(item => item !== id))
        setLoadedTournaments((list) => [...list, id])
      })
    }
  };

  return (
    <TournamentsContext.Provider value={{
      tournaments: state.tournaments,
      error,
      loadedTournaments,
      loadTournaments,
      loadTournament
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}