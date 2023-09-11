import { createBrowserRouter } from 'react-router-dom';

import Root from '../layout/Root';
import Tournaments from '../components/Tournament/TournamentList';
import Teams from '../components/Team/Teams';
import Stats from '../components/Stats/Stats';
import TournamentDetail from '../components/Tournament/Detail/TournamentDetail';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Tournaments />},
      { path: '/teams', element: <Teams /> },
      { path: '/stats', element: <Stats /> },
      { path: '/:tournamentId', element: <TournamentDetail /> }
    ]
  }

])

export default Router