import { logout } from '@/apis/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useAccountStore from '@/stores/account';
import useCredentialStore from '@/stores/credential';
import { useNavigate } from 'react-router';

type Props = {
  className?: string;
};

const UserDropdown = ({ className }: Props) => {
  const { name, email, avatar } = useAccountStore();
  const navigate = useNavigate();
  const { clear } = useCredentialStore();

  const signOut = () => {
    clear();
    logout();
    navigate('/auth/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            'p-2 flex gap-2 items-center cursor-pointer',
            className,
          )}
        >
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-white bg-primary">
              {name.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="text-start grow w-0">
            <p className="text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground text-ellipsis w-full overflow-hidden">
              {email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-sm" align="start" side="top">
        <DropdownMenuItem className="cursor-pointer">账号设置</DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-700 focus:text-red-900"
          onClick={signOut}
        >
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
