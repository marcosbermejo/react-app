import { createBrowserRouter } from 'react-router-dom';

import Root from '../layout/Root';
import Tournaments from '../pages/Tournaments';
import Tournament from '../pages/Tournament';
import Teams from '../pages/Teams';
import Stats from '../pages/Stats';
import Match from '../pages/Match';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Tournaments />},
      { path: '/teams', element: <Teams /> },
      { path: '/stats', element: <Stats /> },
      { path: '/:tournamentId', element: <Tournament /> },
      { path: '/:tournamentId/matches/:matchId', element: <Match /> }
    ]
  }
])

export default Router