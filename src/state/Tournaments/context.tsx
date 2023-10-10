import { ReactNode, createContext } from "react";
import { ScoringsFetcher, StandingsFetcher } from "../../services/api";
import useTournaments, { TournamentsState } from "./useTournaments";
import useResources, { ResourcesState } from "./useResources";
import Match from "../../models/Match";
import Scoring from "../../models/Scoring";
import Profile from "../../models/Profile";
import Standing from "../../models/Standing";
import useGroups, { GroupsState } from "./useGroups";
import useMatches, { MatchesState } from "./useMatches";

interface IContext {
  tournamentsState: TournamentsState,
  matchesState: MatchesState,
  groupsState: GroupsState,
  scoringsState: ResourcesState<Scoring>,
  standingsState: ResourcesState<Standing>,
  loadTournaments: () => void,
  loadDates: (tournamentId: string) => void
  loadMatches: (groupId: string, page?: number, withDate?: boolean) => void
  loadMatch: (groupId: string, matchId: string) => void
  loadGroups: (tournamentId: string) => void
  loadStandings: (groupId: string) => void
  loadScorings: (matchId: string, page?: number, tournamentId?: string) => void  
}

export const TournamentsContext = createContext<IContext>({
  tournamentsState: { tournamentStates: [], loaded: false, loading: false, error: '' },
  matchesState: {},
  groupsState: {},
  scoringsState: {},
  standingsState: {},
  loadTournaments: () => {},
  loadDates: () => {},
  loadMatches: () => {},
  loadMatch: () => {},
  loadGroups: () => {},
  loadScorings: () => {},
  loadStandings: () => {},
});

export default function TournamentsProvider({ children }: { children: ReactNode }) {
  const { tournamentsState, loadTournaments, loadDates } = useTournaments()
  const { groupsState, loadGroups } = useGroups()
  const { matchesState, loadMatches, loadMatch } = useMatches()


  const { resourcesState: scoringsState, loadResources: loadScorings } = useResources<Scoring>(new ScoringsFetcher())
  const { resourcesState: standingsState, loadResources: loadStandings } = useResources<Standing>(new StandingsFetcher())
  
  return (
    <TournamentsContext.Provider value={{
      tournamentsState,
      matchesState,
      groupsState,
      scoringsState,
      standingsState,

      loadTournaments,
      loadDates,
      loadMatches,
      loadMatch,
      loadGroups,
      loadScorings,
      loadStandings
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}