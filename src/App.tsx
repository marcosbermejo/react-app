import React from 'react';
import { useTournaments } from './hooks/useTournaments'; // Asegúrate de ajustar la ruta
import Tournaments from './components/Tournaments';
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Container, Paper, Typography } from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
function App() {
  const { tournaments, error, isLoading } = useTournaments();

  const [value, setValue] = React.useState(1);


  if (error) return <div>Error al cargar los datos</div>;
  if (isLoading) return <div>loading...</div>


  return (
    <Container maxWidth="md">
      <Box>
        <AppBar position="static">
          <Typography variant="h6" sx={{ ml: 2, my: 2 }}>
            Waterpolo Tournaments
          </Typography>
        </AppBar>
      </Box>

      <Tournaments tournaments={tournaments} />

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Teams" icon={<SportsVolleyballIcon />} />
          <BottomNavigationAction label="Tournaments" icon={<EmojiEventsIcon />} />
          <BottomNavigationAction label="Stats" icon={<QueryStatsIcon />} />
        </BottomNavigation>
      </Paper>

    </Container>
  );

}

export default App;
