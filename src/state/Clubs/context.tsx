import { ReactNode, createContext } from "react";
import useClubs, { ClubsState } from "./useClubs";
import useResources, { ResourcesState } from "../Tournaments/useResources";
import Match from "../../models/Match";
import { ClubMatchesFetcher } from "../../services/api";

interface IContext {
  clubsState: ClubsState,
  matchesState: ResourcesState<Match>,
  loadClubs: () => void,
  loadClub: (clubId: string) => void,
  loadMatches: (clubId: string, page?: number, date?: Date) => void
}

export const ClubsContext = createContext<IContext>({
  clubsState: { clubStates: [], loaded: false, loading: false, error: '' },
  matchesState: {},
  loadClubs: () => {},
  loadClub: () => {},
  loadMatches: () => {}
});

export default function ClubsProvider({ children }: { children: ReactNode }) {
  const { clubsState, loadClubs, loadClub } = useClubs()
  const { resourcesState: matchesState, loadResources: loadMatches } = useResources<Match>(new ClubMatchesFetcher())

  return (
    <ClubsContext.Provider value={{
      clubsState,
      matchesState,
      loadClubs,
      loadClub,
      loadMatches
    }}>
      {children}
    </ClubsContext.Provider>
  );
}