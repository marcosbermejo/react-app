import { useContext } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderContext } from "../state/Header/context";

const toTitleCase = (title: string) => (
  title.charAt(0).toUpperCase() +
  title.substring(1).toLowerCase()
)

export default function Header() {
  const { title } = useContext(HeaderContext)
  const navigate = useNavigate();

  return (
    <AppBar>
      <Toolbar>
        {
          <IconButton
            size="large"
            edge="start"
            color="inherit"
          >
            <MenuIcon  />
          </IconButton>
        }

        <Typography noWrap variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          {toTitleCase(title)}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}