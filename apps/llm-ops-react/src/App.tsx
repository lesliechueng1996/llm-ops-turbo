import { Toaster } from '@/components/ui/sonner.tsx';
import LoginPage from '@/pages/auth/LoginPage';
import AuthorizePage from '@/pages/auth/AuthorizePage';
import { BrowserRouter, Route, Routes } from 'react-router';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import AuthorizedLayout from '@/layouts/AuthorizedLayout';
import HomePage from '@/pages/home/HomePage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="authorize/:providerName" element={<AuthorizePage />} />
          </Route>
          <Route element={<AuthorizedLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export default App;
