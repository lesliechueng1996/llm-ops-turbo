import { cn } from '@/lib/utils';
import { Link } from 'react-router';

type Props = {
  className?: string;
  href?: string;
};

const logoClass = 'w-28 h-9 rounded-lg bg-border';

const Logo = ({ className, href }: Props) => {
  if (href) {
    return (
      <Link className={cn('w-fit', className)} to={href}>
        <div className={logoClass} />
      </Link>
    );
  }

  return <div className={cn(logoClass, className)} />;
};

export default Logo;
