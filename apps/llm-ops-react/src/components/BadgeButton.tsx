import { cn } from '@/lib/utils';

type Props = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const BadgeButton = ({ label, isActive, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3.5 py-1.5 rounded-[8px] text-sm',
        isActive && 'bg-muted-foreground text-muted',
      )}
    >
      {label}
    </button>
  );
};
export default BadgeButton;
