import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

const FormModal = ({
  title,
  description,
  open,
  onOpenChange,
  children,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="max-h-[600px] overflow-y-auto no-scrollbar pt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
