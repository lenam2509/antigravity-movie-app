// removed unused React import
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import CategoryPage from './pages/CategoryPage';
import WatchlistPage from './pages/WatchlistPage';
import { WatchlistProvider } from './context/WatchlistContext';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="phim/:slug" element={<MovieDetailPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </QueryClientProvider>
  );
}

export default App;
