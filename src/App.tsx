import Router from './layout/Router';
import { RouterProvider } from 'react-router-dom';
import HeaderProvider from './state/Header/provider';
import TournamentsProvider from './state/Tournaments/context';

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
