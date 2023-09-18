import { createBrowserRouter } from 'react-router-dom';

import Root from '../layout/Root';
import Tournaments from '../pages/Tournaments';
import Tournament from '../pages/Tournament';
import Clubs from '../pages/Clubs';
import News from '../pages/News';
import Match from '../pages/Match';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Tournaments />},
      { path: '/clubs', element: <Clubs /> },
      { path: '/news', element: <News /> },
      { path: '/:tournamentId', element: <Tournament /> },
      { path: '/:tournamentId/matches/:matchId', element: <Match /> }
    ]
  }
]);

export default Router;
