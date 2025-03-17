import useAuthGuard from '@/hooks/useAuthGuard';
import { Outlet } from 'react-router';
import SideBar from './components/side-bar/SideBar';

const SidebarLayout = () => {
  useAuthGuard();

  return (
    <div className="h-screen w-screen flex bg-muted">
      <SideBar className="w-60 h-screen shrink-0" />

      <div className="grow p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
