import { cn } from '@/lib/utils';
import { JSX } from 'react';
import { Link } from 'react-router';

type Props = {
  label: string;
  icon: () => JSX.Element;
  activeIcon: () => JSX.Element;
  href: string;
  isActive: boolean;
};

const MenuItem = ({
  label,
  icon: DefaultIcon,
  activeIcon: ActiveIcon,
  href,
  isActive,
}: Props) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center p-2 gap-2 w-full rounded-lg text-sm hover:bg-muted transition-all',
        isActive ? 'bg-muted' : '',
      )}
    >
      {isActive ? <ActiveIcon /> : <DefaultIcon />}
      <span>{label}</span>
    </Link>
  );
};

export default MenuItem;
