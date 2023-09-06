import React from 'react'
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export default function Navigation() {
  const [value, setValue] = React.useState(1);

  return (
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
  )
}
