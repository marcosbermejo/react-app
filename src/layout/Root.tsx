import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom'
import Header from './Header';
import Navigation from './Navigation';

export default function Root () {
  return (
    <Container maxWidth="md">
      <Header />
      <Outlet />
      <Navigation />
    </Container>
  );
}