import { useState } from 'react';
import FormModal from './FormModal';
import LoadingButton from './LoadingButton';
import { Button } from './ui/button';

type Props = {
  title: string;
  description: string;
  content: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  content,
  onConfirm,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <FormModal
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">{content}</p>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <LoadingButton
            type="button"
            onClick={handleConfirm}
            text="确认"
            isLoading={loading}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default ConfirmModal;
