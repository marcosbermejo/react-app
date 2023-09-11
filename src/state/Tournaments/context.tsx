import { createContext } from "react";
import { State } from "./reducer";

interface IContext {
  state: State,
  loadTournaments: () => void,
  loadMatches: (tournamentId: string) => void
  loadGroups: (tournamentId: string) => void
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
  loadGroups: () => {}
});
