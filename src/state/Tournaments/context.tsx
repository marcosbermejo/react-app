import { createContext } from "react";
import { State } from "./reducer";

interface IContext {
  state: State,
  loadTournaments: () => void,
  loadDates: (tournamentId: string) => void
  loadMatches: (tournamentId: string) => void
  loadGroups: (tournamentId: string) => void
  loadMatch: (tournamentId: string, matchId: string) => void
}

export const TournamentsContext = createContext<IContext>({
  state: {
    tournaments: [],
    loading: false,
    loaded: false,
    error: ''
  },
  loadTournaments: () => {},
  loadDates: () => {},
  loadMatches: () => {},
  loadGroups: () => {},
  loadMatch: () => {},
});
