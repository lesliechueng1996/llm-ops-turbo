import { Toaster } from '@/components/ui/sonner.tsx';
import AuthorizePage from '@/pages/auth/AuthorizePage';
import LoginPage from '@/pages/auth/LoginPage';
import HomePage from '@/pages/home/HomePage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import SidebarLayout from './layouts/SidebarLayout';
import DatasetPage from './pages/space/dataset/DatasetPage';
import DocumentPage from './pages/space/dataset/document/DocumentPage';
import BatchFilePage from './pages/space/dataset/document/batch/BatchFilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route
                path="authorize/:providerName"
                element={<AuthorizePage />}
              />
            </Route>
            <Route element={<SidebarLayout />}>
              <Route path="" element={<Navigate to="/home" />} />
              <Route path="home" element={<HomePage />} />
              <Route path="space">
                <Route path="" element={<Navigate to="/space/dataset" />} />
                <Route path="dataset" element={<DatasetPage />} />
                <Route path="dataset/:id/document" element={<DocumentPage />} />
                <Route
                  path="dataset/:id/document/batch"
                  element={<BatchFilePage />}
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors closeButton />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

export default App;
