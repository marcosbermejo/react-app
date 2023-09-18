import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Club from "../../models/Club";
import Tournament from "../../models/Tournament";
import Team from "../../models/Team";
import { TournamentsContext } from "../Tournaments/context";

interface IContext {
  clubs: Club[],
  loading: boolean,
  loaded: boolean,
  error: string,  
  loadClubs: () => void,
}

export const ClubsContext = createContext<IContext>({
  clubs: [],
  loading: false,
  loaded: false,
  error: '',   
  loadClubs: () => {},
});

const teamsReducer = (clubs: Record<string, Club>, team: Team): Record<string, Club> => {
  if (!team.club) return clubs
  return { ...clubs, [team.club.id]: team.club }
}

const tournamentsReducer = (clubs: Record<string, Club>, tournament: Tournament): Record<string, Club> => ({
  ...clubs,
  ...tournament.teams.reduce(teamsReducer, {})
})

export default function ClubsProvider({ children }: { children: ReactNode }) {
  const { loadTournaments, tournamentsState: { tournamentStates, error, loading, loaded } } = useContext(TournamentsContext)
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    const clubs = tournamentStates
      .map(({tournament}) => tournament)
      .reduce(tournamentsReducer, {})

    const sortedClubs = Object.values(clubs).sort((a, b) => {
      const justNameA = a.name.split('.').at(-1)?.trim() ?? a.name
      const justNameB = b.name.split('.').at(-1)?.trim() ?? b.name

      return justNameA.localeCompare(justNameB)
    })
    setClubs(sortedClubs)
  }, [tournamentStates])

  return (
    <ClubsContext.Provider value={{
      clubs,
      loading,
      loaded,
      error,
      loadClubs: loadTournaments
    }}>
      {children}
    </ClubsContext.Provider>
  );
}
