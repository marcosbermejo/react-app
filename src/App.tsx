import React from 'react';
import { format } from 'date-fns'
import { useTournaments } from './data/Tournament'; // Asegúrate de ajustar la ruta
import Tournaments from './components/Tournaments';
import { Container } from '@mui/material';

/**
 * Formats date to dd/MM/yyyy Adds HH:mm if hour = true
 */
const formatDate = (date: Date | null, hour = false): string => {
  if (!date) return ''
  return format(date, `dd/MM/yyyy${hour ? ' HH:mm' : ''}`)
}

function App() {
  const { tournaments, error, isLoading } = useTournaments();

  if (error) return <div>Error al cargar los datos</div>;
  if (isLoading) return <div>loading...</div>

  return (
    <Container maxWidth="md">
      <Tournaments tournaments={tournaments} />
    </Container>
  )


  return (
    <div>
      <h1>Waterpolo Tournaments</h1>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            {tournament.name}
            <ul>
              {tournament.groups?.map((group) => (
                <li key={group.id}>
                  {group.name}
                  <ul>
                    {group.rounds?.map((round) => (
                      <li key={round.id}>
                        {round.name}, {formatDate(round.start_date)} {round.end_date !== round.start_date ?? round.end_date}
                        <ul>
                          {round.matches?.map((match) => (
                            match.homeTeam && match.awayTeam &&
                            <li key={match.id}>
                              {match.homeTeam.name} VS {match.awayTeam.name}: {formatDate(match.date, true)}
                            </li>
                          ))}
                        </ul>                        
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App;
