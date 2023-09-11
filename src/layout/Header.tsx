import { useContext } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { HeaderContext } from "../state/Header/context";

const toTitleCase = (title: string) => (
  title.charAt(0).toUpperCase() +
  title.substring(1).toLowerCase()
)

export default function Header() {
  const { title, previous } = useContext(HeaderContext)

  return (
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
          {toTitleCase(title)}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}