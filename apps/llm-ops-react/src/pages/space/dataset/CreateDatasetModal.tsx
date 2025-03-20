import FormModal from '@/components/FormModal';
import useSpaceCreateModal from '@/stores/space-create-modal';
import DatasetForm from './DatasetForm';

const CreateDatasetModal = () => {
  const { open, setOpen } = useSpaceCreateModal();

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
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </FormModal>
  );
};

export default CreateDatasetModal;
