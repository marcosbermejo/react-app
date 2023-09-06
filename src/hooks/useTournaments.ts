import useSWRImmutable from 'swr';
import fetcher from '../util/Fetcher';
import { ApiResponse } from '../interfaces/ApiResponse';
import Tournament from '../interfaces/Tournament';
import TournamentMapper from '../util/TournamentMapper';

const URL = 'http://localhost:3000'

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