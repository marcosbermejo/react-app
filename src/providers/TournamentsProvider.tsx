import axios from "axios";
import { ReactNode, createContext, useState, useEffect } from "react";
import Tournament from "../interfaces/Tournament";
import { ApiResponse } from "../interfaces/ApiResponse";
import TournamentMapper from "../util/TournamentMapper";

const URL = 'https://localhost:3000'

interface IContext {
  load: () => void,
  tournaments?: Tournament[],
  error?: string,
}

export const TournamentsContext = createContext<IContext>({ load: () => { } });

export default function TournamentsProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const load = () => {
    if (!tournaments && !isLoading) {
      axios
        .get<ApiResponse>(URL)
        .then(response => {
          const mapper = new TournamentMapper(response.data)
          setTournaments(mapper.mapTournaments());
          setError(undefined)
        })
        .catch(error => {
          setError(error.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <TournamentsContext.Provider value={{
      tournaments,
      error,
      load
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}