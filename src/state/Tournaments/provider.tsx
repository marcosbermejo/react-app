import { ReactNode, useReducer } from "react";
import reducer from "./reducer";
import { TournamentsContext } from "./context";
import { fetchGroups, fetchMatches, fetchTournaments, fetchFirstMatch, fetchLastMatch, fetchReferees, fetchScorings, fetchStandings } from "../../services/api";

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

      loadDates: async (tournamentId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState || !tournamentState.loading || !tournamentState.loaded) return;

        try {
          const firstMatch = (await fetchFirstMatch(tournamentId))[0]
          const lastMatch = (await fetchLastMatch(tournamentId))[0]

          dispatch({ type: 'SET_TOURNAMENT_LOADING', tournamentId });
          dispatch({ type: 'SET_TOURNAMENT_DATES', tournamentId, start: firstMatch?.date, end: lastMatch?.date });
  
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_TOURNAMENT_ERROR', tournamentId, error: err.message });
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
      },

      loadReferees: async (tournamentId: string, matchId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState) return;

        const matchState = tournamentState.matchesState.matches.find(({match}) => match.id === matchId)
        if (!matchState) return;

        try {
          dispatch({ type: 'SET_REFEREES_LOADING', tournamentId, matchId });
          dispatch({ type: 'SET_REFEREES', tournamentId, matchId, referees: await fetchReferees(matchId) });        
           
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_REFEREES_ERROR', tournamentId, matchId, error: err.message });
        }
      },

      loadScorings: async (tournamentId: string, matchId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState) return;

        const matchState = tournamentState.matchesState.matches.find(({match}) => match.id === matchId)
        if (!matchState) return;

        try {
          dispatch({ type: 'SET_SCORINGS_LOADING', tournamentId, matchId });
          dispatch({ type: 'SET_SCORINGS', tournamentId, matchId, scorings: await fetchScorings(tournamentId, matchId) });        
           
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_SCORINGS_ERROR', tournamentId, matchId, error: err.message });
        }
      },

      loadStandings: async (tournamentId: string, groupId: string) => {
        const tournamentState = state.tournaments.find(({tournament}) => tournament.id === tournamentId)       
        if (!tournamentState) return;

        const groupState = tournamentState.groupsState.groups.find(({group}) => group.id === groupId)
        if (!groupState) return;

        try {
          dispatch({ type: 'SET_STANDINGS_LOADING', tournamentId, groupId });
          dispatch({ type: 'SET_STANDINGS', tournamentId, groupId, standings: await fetchStandings(groupId) });        
           
        } catch (err: any) {
          console.log(err)
          dispatch({ type: 'SET_STANDINGS_ERROR', tournamentId, groupId, error: err.message });
        }
      }
    }}>
      {children}
    </TournamentsContext.Provider>
  );
}