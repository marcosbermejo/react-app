import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from "react-router-dom";

import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import FeedIcon from '@mui/icons-material/Feed';

export default function Navigation() {
  const location = useLocation();
  const [value, setValue] = useState('');

  useEffect(() => {
    const { pathname } = location
    const value = pathname.includes('clubs') ? '/clubs' : (pathname.includes('news') ? '/news' : '/')
    setValue(value);
  }, [location])
  
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
        <BottomNavigationAction value="/clubs" component={RouterLink} to="/clubs" label="Clubs" icon={<SportsVolleyballIcon />} />
        <BottomNavigationAction value="/" component={RouterLink} to="/" label="Competicions" icon={<EmojiEventsIcon />} />
        <BottomNavigationAction value="/news" component={RouterLink} to="/news" label="Notícies" icon={<FeedIcon />} />
      </BottomNavigation>
    </Paper>
  )
}
