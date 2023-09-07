import { RouterProvider } from 'react-router-dom';

import TournamentsProvider from './providers/TournamentsProvider';
import Router from './layout/Router';

function App() {
  return (
    <TournamentsProvider>
      <RouterProvider router={Router} />
    </TournamentsProvider>
  )
}

export default App;
