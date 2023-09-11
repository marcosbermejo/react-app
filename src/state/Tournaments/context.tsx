import { createContext } from "react";
import { State } from "./reducer";

interface IContext {
  state: State,
  loadTournaments: () => void,
  loadMatches: (tournamentId: string) => void
  loadStandings: (tournamentId: string, groupId: string) => void
}

export const TournamentsContext = createContext<IContext>({
  state: {
    tournaments: [],
    loading: false,
    loaded: false,
    error: ''
  },
  loadTournaments: () => {},
  loadMatches: () => {},
  loadStandings: () => {}
});
