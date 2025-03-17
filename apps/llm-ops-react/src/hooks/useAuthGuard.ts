import useCredentialStore from '@/stores/credential';
import { getCurrentAccount } from '@/apis/account';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useAccountStore from '@/stores/account';

const useAuthGuard = () => {
  const { isAuthenticated } = useCredentialStore();
  const navigate = useNavigate();
  const { setAccount } = useAccountStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth/login', { replace: true });
      return;
    }

    getCurrentAccount()
      .then((res) => {
        setAccount({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error('获取当前账户信息失败');
      });
  }, [isAuthenticated, navigate, setAccount]);
};

export default useAuthGuard;
