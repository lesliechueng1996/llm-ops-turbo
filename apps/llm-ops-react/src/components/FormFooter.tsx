import LoadingButton from './LoadingButton';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

type Props = {
  onCancel: () => void;
};

const FormFooter = ({ onCancel }: Props) => {
  const { pending } = useFormStatus();

  return (
    <div className="text-right space-x-4">
      <Button type="button" variant="secondary" onClick={onCancel}>
        取消
      </Button>
      <LoadingButton type="submit" text="保存" isLoading={pending} />
    </div>
  );
};

export default FormFooter;
