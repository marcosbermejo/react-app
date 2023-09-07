import { createBrowserRouter } from 'react-router-dom';

import Root from '../layout/Root';
import Tournaments from '../components/Tournament/Tournaments';
import Teams from '../components/Team/Teams';
import Stats from '../components/Stats/Stats';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Tournaments />},
      { path: '/teams', element: <Teams /> },
      { path: '/stats', element: <Stats /> },
      { path: '/*', element: <Tournaments /> }
    ]
  }

])

export default Router