import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router';

type Props = {
  iconUrl: string;
  title: string;
  isChecked?: boolean;
  subTitle: string;
  action: ReactNode;
  content: string;
  avatarUrl: string;
  name: string;
  footerText: string;
  href: string;
};

const Card = ({
  iconUrl,
  title,
  isChecked = false,
  subTitle,
  action,
  content,
  avatarUrl,
  name,
  footerText,
  href,
}: Props) => {
  return (
    <Link
      to={href}
      className="flex flex-col gap-3 w-96 h-52 p-4 rounded-lg border border-stone-300 shadow bg-background"
    >
      <div className="shrink-0 min-h-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={iconUrl} alt={title} className="size-10 rounded-lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{title}</h1>
              {isChecked && <CheckCircle className="size-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground">{subTitle}</p>
          </div>
        </div>
        <div>{action}</div>
      </div>
      <p className="grow text-sm text-muted-foreground line-clamp-4">
        {content}
      </p>
      <div className="shrink-0 min-h-0 flex items-center gap-1 text-xs text-muted-foreground">
        <Avatar className="size-4">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-accent bg-primary">
            {name.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs">{name}</p>
        <p>·</p>
        <p className="text-xs">{footerText}</p>
      </div>
    </Link>
  );
};

export default Card;
