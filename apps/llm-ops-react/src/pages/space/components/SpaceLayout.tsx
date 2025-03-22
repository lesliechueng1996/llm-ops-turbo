import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import useSearchKeyword from '@/hooks/useSearchKeyword';
import HeaderLayout from '@/layouts/HeaderLayout';
import { UserFillIcon } from '@/layouts/components/icons';
import useSpaceCreateModal from '@/stores/space-create-modal';
import { ReactNode } from 'react';
import SpaceMenu from './SpaceMenu';

type Props = {
  label: string;
  children: ReactNode;
};

const SpaceLayout = ({ children, label }: Props) => {
  const { keyword, setKeyword } = useSearchKeyword();
  const { open, openModal } = useSpaceCreateModal();

  return (
    <HeaderLayout
      title="个人空间"
      icon={<UserFillIcon />}
      actionButton={<Button onClick={openModal}>创建{label}</Button>}
      filterGroup={<SpaceMenu />}
      searchFilter={
        <SearchInput
          className="w-64"
          placeholder={`请输入${label}名称`}
          defaultValue={keyword}
          onConfirm={setKeyword}
        />
      }
    >
      {children}
    </HeaderLayout>
  );
};

export default SpaceLayout;
