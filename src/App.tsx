import Router from './layout/Router';
import { RouterProvider } from 'react-router-dom';
import { TournamentsProvider } from './contexts/Tournaments/TournamentsContext';
import { HeaderProvider } from './contexts/HeaderContext';

function App() {
  return (
    <TournamentsProvider>
      <HeaderProvider>
        <RouterProvider router={Router} />
      </HeaderProvider>
    </TournamentsProvider>
  )
}

export default App;
