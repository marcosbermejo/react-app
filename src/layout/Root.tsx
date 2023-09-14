import { Container, Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom'
import Header from './Header';
import Navigation from './Navigation';
import { ScrollRestoration } from "react-router-dom";


export default function Root() {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
        <Header />
        <Stack sx={{ pt: { xs: 7, sm: 8}}} pb={7} minHeight={'100vh'} spacing={2}>
          <Outlet />
        </Stack>
        <Navigation />
      <ScrollRestoration />
    </Container>
  );
}