import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { HeaderContext } from "../contexts/HeaderContext";
import { useContext } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Header() {

  const { title, previous } = useContext(HeaderContext)

  return (
    <Box pb={7}>
      <AppBar>
        <Toolbar>
          {
            previous &&
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                component={RouterLink} to={previous}
              >
                <ArrowBackIcon />
              </IconButton>
          }

          <Typography noWrap variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          { title }
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}