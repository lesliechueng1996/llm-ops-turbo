import {
  deleteDataset,
  getDataset,
  getDatasetPagination,
} from '@/apis/dataset';
import ConfirmModal from '@/components/ConfirmModal';
import usePaginationQuery from '@/hooks/usePaginationQuery';
import { getErrorMessage } from '@/lib/utils';
import useAccountStore from '@/stores/account';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ComponentProps, useRef, useState } from 'react';
import { toast } from 'sonner';
import SpaceLayout from '../components/SpaceLayout';
import CreateDatasetModal from './components/CreateDatasetModal';
import DatasetCard from './components/DatasetCard';
import UpdateDatasetModal from './components/UpdateDatasetModal';

type UpdaateDataset = ComponentProps<typeof UpdateDatasetModal>['dataset'];

const DatasetPage = () => {
  const { name, avatar } = useAccountStore();

  const queryClient = useQueryClient();
  const { list, LoadMore } = usePaginationQuery({
    fetchFn: getDatasetPagination,
    queryKey: 'datasets',
  });

  const { mutateAsync: deleteDatasetAsync } = useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const [updateDataset, setUpdateDataset] = useState<UpdaateDataset | null>(
    null,
  );
  const [updateDatasetModal, setUpdateDatasetModal] = useState(false);
  const [deleteDatasetModal, setDeleteDatasetModal] = useState(false);
  const deleteDatasetId = useRef<string | null>(null);

  const handleEdit = async (id: string) => {
    try {
      const dataset = await getDataset(id);
      setUpdateDataset(dataset.data);
      setUpdateDatasetModal(true);
    } catch (error) {
      toast.error(getErrorMessage(error, '获取知识库详情失败'));
    }
  };

  const handleDelete = (id: string) => {
    deleteDatasetId.current = id;
    setDeleteDatasetModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDatasetId.current) {
      return;
    }
    try {
      await deleteDatasetAsync(deleteDatasetId.current);
      toast.success('删除成功');
    } catch (error) {
      toast.error(getErrorMessage(error, '删除知识库失败'));
    }
  };
  return (
    <>
      <SpaceLayout label="知识库">
        <div className="flex flex-wrap gap-5">
          {list.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              {...dataset}
              avatar={avatar}
              accountName={name}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {LoadMore}
      </SpaceLayout>

      <CreateDatasetModal />
      {updateDataset && (
        <UpdateDatasetModal
          open={updateDatasetModal}
          onOpenChange={setUpdateDatasetModal}
          dataset={updateDataset}
        />
      )}
      <ConfirmModal
        open={deleteDatasetModal}
        onOpenChange={setDeleteDatasetModal}
        title="要删除知识库吗？"
        description="删除知识库"
        content="删除知识库后，关联该知识库的应用将无法再使用该知识库，所有的提示配置和文档都将被永久删除。"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default DatasetPage;
