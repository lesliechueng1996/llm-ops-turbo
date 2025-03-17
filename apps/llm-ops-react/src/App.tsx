import { Toaster } from '@/components/ui/sonner.tsx';
import AuthorizePage from '@/pages/auth/AuthorizePage';
import LoginPage from '@/pages/auth/LoginPage';
import HomePage from '@/pages/home/HomePage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import SidebarLayout from './layouts/SidebarLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="authorize/:providerName" element={<AuthorizePage />} />
          </Route>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;
