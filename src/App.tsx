import Router from './layout/Router';
import { RouterProvider } from 'react-router-dom';
import TournamentsProvider from './state/Tournaments/provider';
import HeaderProvider from './state/Header/provider';

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
