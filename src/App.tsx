import Router from './layout/Router';
import { RouterProvider } from 'react-router-dom';
import HeaderProvider from './state/Header/provider';
import TournamentsProvider from './state/Tournaments/context';
import ClubsProvider from './state/Clubs/context';

function App() {
  return (
    <TournamentsProvider>
      <HeaderProvider>
        <ClubsProvider>
          <RouterProvider router={Router} />
        </ClubsProvider>
      </HeaderProvider>
    </TournamentsProvider>
  )
}

export default App;
