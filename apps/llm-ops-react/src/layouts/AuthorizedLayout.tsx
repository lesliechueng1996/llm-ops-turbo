import useCredentialStore from '@/stores/credential';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

const AuthorizedLayout = () => {
  const { isAuthenticated } = useCredentialStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default AuthorizedLayout;
