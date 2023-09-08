import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom'
import Header from './Header';
import Navigation from './Navigation';
import { ScrollRestoration } from "react-router-dom";

export default function Root () {
  return (
    <Container maxWidth="md" sx={{px: {xs: 0, sm: 2}}}>
      <Header />
      <Outlet />
      <Navigation />
      <ScrollRestoration getKey={(location, matches) => location.pathname } />
    </Container>
  );
}