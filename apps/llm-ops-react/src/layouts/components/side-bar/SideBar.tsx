import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useLocation } from 'react-router';
import {
  AppFillIcon,
  AppIcon,
  HomeFillIcon,
  HomeIcon,
  OpenFillIcon,
  OpenIcon,
  ToolFillIcon,
  ToolIcon,
  UserFillIcon,
  UserIcon,
} from '../icons';
import MenuItem from './MenuItem';
import UserDropdown from './UserDropdown';

type Props = {
  className?: string;
};

const menus = [
  { label: '主页', href: '/home', icon: HomeIcon, activeIcon: HomeFillIcon },
  {
    label: '个人空间',
    href: '/space',
    icon: UserIcon,
    activeIcon: UserFillIcon,
  },
];

const discoverMenus = [
  {
    label: '应用广场',
    href: '/store/apps',
    icon: AppIcon,
    activeIcon: AppFillIcon,
  },
  {
    label: '插件广场',
    href: '/store/tools',
    icon: ToolIcon,
    activeIcon: ToolFillIcon,
  },
  { label: '开放API', href: '/open', icon: OpenIcon, activeIcon: OpenFillIcon },
];

const SideBar = ({ className }: Props) => {
  const { pathname } = useLocation();

  return (
    <aside className={cn('p-2', className)}>
      <div className="bg-white rounded-lg h-full px-2 py-4 flex flex-col gap-2">
        <Logo className="mb-5 shrink-0 cursor-pointer" href="/home" />

        <Button className="w-full mb-4 shrink-0">
          <Plus /> 创建 AI 应用
        </Button>

        <div className="space-y-2 grow">
          {menus.map((menu) => (
            <MenuItem
              key={menu.label}
              {...menu}
              isActive={pathname.startsWith(menu.href)}
            />
          ))}
          <h2 className="text-sm text-muted-foreground px-2">探索</h2>
          {discoverMenus.map((menu) => (
            <MenuItem
              key={menu.label}
              {...menu}
              isActive={pathname.startsWith(menu.href)}
            />
          ))}
        </div>

        <UserDropdown className="shrink-0" />
      </div>
    </aside>
  );
};

export default SideBar;
