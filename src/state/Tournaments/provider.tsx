import { ReactNode, useReducer } from "react";
import reducer from "./reducer";
import { TournamentsContext } from "./context";
import { fetchGroups, fetchMatches, fetchTournaments, fetchMatch } from "../../services/api";

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
          const matches = await fetchMatches(tournamentId)
          matches.forEach(match => match.tournamentId = tournamentId)
          dispatch({ type: 'SET_MATCHES', tournamentId, matches });        
 
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
      },

      loadMatch: async (tournamentId: string, matchId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState) return;

        const matchState = tournamentState.matchesState.matches.find(({match}) => match.id === matchId)
        if (!matchState || matchState.loaded || matchState.loading) return;

        try {
          dispatch({ type: 'SET_MATCH_LOADING', tournamentId, matchId });
          const match =  await fetchMatch(tournamentId, matchId)
          if (!match) throw Error('Match not found')

          dispatch({ type: 'SET_MATCH', tournamentId, matchId, match });        
           
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_MATCH_ERROR', tournamentId, matchId, error: err.message });
        }

      }
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}