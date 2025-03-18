import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ComponentProps, ReactNode } from 'react';

type Props = {
  required?: boolean;
  children: ReactNode;
  label: string;
} & ComponentProps<typeof Label>;

const LabelWrap = ({ required, children, label, ...props }: Props) => {
  return (
    <div className="grid w-full items-center gap-3">
      <Label {...props} className={cn(required && 'required-label')}>
        {label}
      </Label>
      {children}
    </div>
  );
};

export default LabelWrap;
