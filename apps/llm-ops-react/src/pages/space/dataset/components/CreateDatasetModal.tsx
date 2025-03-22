import { createDataset } from '@/apis/dataset';
import FormModal from '@/components/FormModal';
import { getErrorMessage } from '@/lib/utils';
import useSpaceCreateModal from '@/stores/space-create-modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DatasetForm from './DatasetForm';

const CreateDatasetModal = () => {
  const { open, setOpen } = useSpaceCreateModal();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const handleSubmit = async (data: DatasetForm) => {
    try {
      await mutateAsync(data);
      toast.success('创建成功');
      setOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, '创建失败'));
    }
  };

  return (
    <FormModal
      title="创建知识库"
      description="创建知识库"
      open={open}
      onOpenChange={setOpen}
    >
      <DatasetForm
        defaultValues={{
          name: '',
          description: '',
          icon: '',
        }}
        onSubmit={handleSubmit}
      />
    </FormModal>
  );
};

export default CreateDatasetModal;
