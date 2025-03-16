import { oauthGithub } from '@/apis/auth';
import LoadingText from '@/components/LoadingText';
import useCredentialStore from '@/stores/credential';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';

const AuthorizePage = () => {
  const { providerName } = useParams();
  const [searchParams] = useSearchParams();
  const { setCredential } = useCredentialStore();
  const navigate = useNavigate();
  // Avoid multiple executions of the effect in development strict mode
  const effectExecuted = useRef(false);

  useEffect(() => {
    if (effectExecuted.current) {
      return;
    }

    effectExecuted.current = true;

    if (providerName === 'github') {
      oauthGithub(searchParams.get('code') ?? '').then((data) => {
        if (!data.accessToken || !data.refreshToken) {
          toast.error('登录失败');
          navigate('/auth/login', { replace: true });
          return;
        }

        setCredential(data.accessToken, data.refreshToken);
        toast.success('登录成功');
        navigate('/', { replace: true });
      });
    }
  }, [providerName, searchParams, setCredential, navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoadingText text="授权中..." />
    </div>
  );
};

export default AuthorizePage;
