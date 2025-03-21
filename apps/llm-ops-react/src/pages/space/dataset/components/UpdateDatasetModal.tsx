import FormModal from '@/components/FormModal';
import DatasetForm from './DatasetForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDataset } from '@/apis/dataset';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
};

const UpdateDatasetModal = ({ open, onOpenChange, dataset }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (data: DatasetForm) => updateDataset(dataset.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const handleSubmit = async (data: DatasetForm) => {
    try {
      await mutateAsync(data);
      toast.success('更新成功');
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, '更新失败'));
    }
  };

  return (
    <FormModal
      title="编辑知识库"
      description="编辑知识库"
      open={open}
      onOpenChange={onOpenChange}
    >
      <DatasetForm defaultValues={dataset} onSubmit={handleSubmit} />
    </FormModal>
  );
};

export default UpdateDatasetModal;
