import React, { useState } from 'react'
import { Link as RouterLink, useLocation } from "react-router-dom";

import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export default function Navigation() {
  const location = useLocation();
  const isTournamentsPath = (path: string) => !['/teams', '/stats'].includes(path)
  const [value, setValue] = useState(isTournamentsPath(location.pathname) ? '/' : location.pathname);
  
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99 }} elevation={3}>
      <BottomNavigation
        sx={{backgroundColor: 'white'}}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction value="/teams" component={RouterLink} to="/teams" label="Teams" icon={<SportsVolleyballIcon />} />
        <BottomNavigationAction value="/" component={RouterLink} to="/" label="Tournaments" icon={<EmojiEventsIcon />} />
        <BottomNavigationAction value="/stats" component={RouterLink} to="/stats" label="Stats" icon={<QueryStatsIcon />} />
      </BottomNavigation>
    </Paper>
  )
}
