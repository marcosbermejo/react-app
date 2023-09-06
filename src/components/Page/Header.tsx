import { AppBar, Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box>
      <AppBar position="static">
        <Typography variant="h6" sx={{ ml: 2, my: 2 }}>
          Waterpolo Tournaments
        </Typography>
      </AppBar>
    </Box>
  )
}