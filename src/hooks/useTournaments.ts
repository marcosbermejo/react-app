import useSWRImmutable from 'swr';
import fetcher from '../util/Fetcher';
import { ApiResponse } from '../interfaces/ApiResponse';
import Tournament from '../interfaces/Tournament';
import TournamentMapper from '../util/TournamentMapper';

const URL = 'https://api.leverade.com/tournaments?filter=season.id:6653,manager.id:314965&include=groups,groups.rounds,groups.rounds.matches,teams&page[size]=100'

export function useTournaments() {
  const { data, error, isLoading } = useSWRImmutable<ApiResponse>(
    URL,
    fetcher,
    {revalidateOnFocus: false}
  );

  let tournaments: Tournament[] = [];

  if (data) {
    const mapper = new TournamentMapper(data)
    tournaments = mapper.mapTournaments()
  }

  return {
    tournaments,
    error,
    isLoading
  };
}