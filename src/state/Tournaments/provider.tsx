import { ReactNode, useReducer } from "react";
import reducer from "./reducer";
import { TournamentsContext } from "./context";
import { fetchGroups, fetchMatches, fetchTournaments } from "../../services/api";

export default function TournamentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tournaments: [], loaded: false, loading: false, error: '' });
  
  return (
    <TournamentsContext.Provider value={{
      state: state,
      loadTournaments: async () => {
        if (state.loaded || state.loading) return;

        try {
          dispatch({ type: 'SET_TOURNAMENTS_LOADING' });
          dispatch({ type: 'SET_TOURNAMENTS', tournaments: await fetchTournaments() });
  
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_TOURNAMENTS_ERROR', error: err.message });
        }
      },

      loadMatches: async (tournamentId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState || tournamentState.matchesState.loaded || tournamentState.matchesState.loading) return;

        try {
          dispatch({ type: 'SET_MATCHES_LOADING', tournamentId });
          dispatch({ type: 'SET_MATCHES', tournamentId, matches: await fetchMatches(tournamentId) });        
 
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_MATCHES_ERROR', tournamentId, error: err.message });
        }
      },
      
      loadGroups: async (tournamentId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState || tournamentState.groupsState.loaded || tournamentState.groupsState.loading) return;

        try {
          dispatch({ type: 'SET_GROUPS_LOADING', tournamentId });
          dispatch({ type: 'SET_GROUPS', tournamentId, groups: await fetchGroups(tournamentId) });        
 
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_GROUPS_ERROR', tournamentId, error: err.message });
        }
      }
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}