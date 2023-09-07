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
      return {
        ...state,
        tournaments: state.tournaments?.map(tournament =>
          tournament.id === action.payload.id
            ? { ...tournament, ...action.payload.tournament }
            : tournament
        ),
      };
    case 'SET_TOURNAMENTS':
      return {
        ...state,
        tournaments: action.payload.tournaments,
      };
    default:
      return state;
  }
};


export default function TournamentsProvider({ children }: { children: ReactNode }) {
  const [loadingTournaments, setLoadingTournaments] = useState<string[]>([]);
  const [loadedTournaments, setLoadedTournaments] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, {});
  const [error, setError] = useState<string | undefined>();

  const loadTournaments = () => {
    if (!state.tournaments) {
      axios
        .get<ApiListResponse>('https://api.leverade.com/tournaments?filter=season.id:6653,manager.id:314965&include=groups,category&page[size]=100')
        .then(({ data }) => {
          const mapper = new TournamentMapper(data)
          dispatch({ type: 'SET_TOURNAMENTS', payload: { tournaments: mapper.mapTournaments() } });
          setError(undefined)
        })
        .catch(error => {
          setError(error.message)
        })
    }
  }

  const loadTournament = (id: string) => {
    if(state.tournaments) {
      const tournament = state.tournaments.find(tournament => tournament.id === id)

      if (tournament && !loadedTournaments.includes(tournament.id) && !loadingTournaments.includes(tournament.id) ) {

        setLoadingTournaments(list => [...list, tournament.id])

        axios
        .get<ApiItemResponse>(`https://api.leverade.com/tournaments/${id}?include=category,groups,groups.rounds,groups.rounds.matches,groups.rounds.matches.facility,teams`)
        .then(response => {
          const mapper = new TournamentMapper({data: [response.data.data], included: response.data.included})
          dispatch({ type: 'UPDATE_TOURNAMENT', payload: { id, tournament: mapper.mapTournaments()[0] } });

          setLoadingTournaments(list => list.filter(item => item !== tournament.id))
          setLoadedTournaments((list) => [...list, tournament.id])
        })
      }
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