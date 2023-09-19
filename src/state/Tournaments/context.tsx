import { ReactNode, createContext } from "react";
import { GroupsFetcher, MatchesFetcher, RefereesFetcher, ScoringsFetcher, StandingsFetcher } from "../../services/api";
import useTournaments, { TournamentsState } from "./useTournaments";
import useResources, { ResourcesState } from "./useResources";
import Match from "../../models/Match";
import Group from "../../models/Group";
import Scoring from "../../models/Scoring";
import Profile from "../../models/Profile";
import Standing from "../../models/Standing";

interface IContext {
  tournamentsState: TournamentsState,
  matchesState: ResourcesState<Match>,
  groupsState: ResourcesState<Group>,
  scoringsState: ResourcesState<Scoring>,
  refereesState: ResourcesState<Profile>,
  standingsState: ResourcesState<Standing>,
  loadTournaments: () => void,
  loadDates: (tournamentId: string) => void
  loadMatches: (groupId: string, page?: number, withDate?: boolean) => void
  loadMatch: (groupId: string, matchId: string) => void
  loadGroups: (tournamentId: string) => void
  loadStandings: (groupId: string) => void
  loadReferees: (matchId: string) => void
  loadScorings: (matchId: string, page?: number, tournamentId?: string) => void  
}

export const TournamentsContext = createContext<IContext>({
  tournamentsState: { tournamentStates: [], loaded: false, loading: false, error: '' },
  matchesState: {},
  groupsState: {},
  scoringsState: {},
  refereesState: {},
  standingsState: {},
  loadTournaments: () => {},
  loadDates: () => {},
  loadMatches: () => {},
  loadMatch: () => {},
  loadGroups: () => {},
  loadScorings: () => {},
  loadReferees: () => {},
  loadStandings: () => {},
});

export default function TournamentsProvider({ children }: { children: ReactNode }) {
  const { tournamentsState, loadTournaments, loadDates } = useTournaments()
  const { resourcesState: matchesState, loadResources: loadMatches, loadResource: loadMatch } = useResources<Match>(new MatchesFetcher())
  const { resourcesState: groupsState, loadResources: loadGroups } = useResources<Group>(new GroupsFetcher())
  const { resourcesState: scoringsState, loadResources: loadScorings } = useResources<Scoring>(new ScoringsFetcher())
  const { resourcesState: refereesState, loadResources: loadReferees } = useResources<Profile>(new RefereesFetcher())
  const { resourcesState: standingsState, loadResources: loadStandings } = useResources<Standing>(new StandingsFetcher())
  
  return (
    <TournamentsContext.Provider value={{
      tournamentsState,
      matchesState,
      groupsState,
      scoringsState,
      refereesState,
      standingsState,

      loadTournaments,
      loadDates,
      loadMatches,
      loadMatch,
      loadGroups,
      loadScorings,
      loadReferees,
      loadStandings
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}