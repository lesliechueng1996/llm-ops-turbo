import { Toaster } from '@/components/ui/sonner.tsx';
import LoginPage from '@/pages/login-page/LoginPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export default App;
