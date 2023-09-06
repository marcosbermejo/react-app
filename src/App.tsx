import React from 'react';
import { useTournaments } from './hooks/useTournaments';
import Tournaments from './components/Tournament/Tournaments';
import { Container } from '@mui/material';

import Loading from './components/Page/Loading';
import Header from './components/Page/Header';
import Navigation from './components/Page/Navigation';

function App() {
  const { tournaments, error, isLoading } = useTournaments();

  if (error) return <div>Error al cargar los datos</div>;
  if (isLoading) return <Loading />

  return (
    <Container maxWidth="md">
      <Header />
      <Tournaments tournaments={tournaments} />
      <Navigation />
    </Container>
  );

}

export default App;
