import { createContext } from "react";
import { TournamentsState } from "./reducer";

interface IContext {
  state: TournamentsState,
  loadTournaments: () => void,
  loadDates: (tournamentId: string) => void
  loadMatches: (tournamentId: string) => void
  loadGroups: (tournamentId: string) => void
  loadScorings: (tournamentId: string, matchId: string) => void
  loadReferees: (tournamentId: string, matchId: string) => void
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
  loadDates: () => {},
  loadMatches: () => {},
  loadGroups: () => {},
  loadScorings: () => {},
  loadReferees: () => {},
  loadStandings: () => {},
});
