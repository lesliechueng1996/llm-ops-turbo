import { Button } from '@/components/ui/button';
import LoadingButton from './LoadingButton';

type Props = {
  isLoading: boolean;
  onCancel: () => void;
};

const FormFooter = ({ onCancel, isLoading }: Props) => {
  return (
    <div className="text-right space-x-4">
      <Button type="button" variant="secondary" onClick={onCancel}>
        取消
      </Button>
      <LoadingButton type="submit" text="保存" isLoading={isLoading} />
    </div>
  );
};

export default FormFooter;
