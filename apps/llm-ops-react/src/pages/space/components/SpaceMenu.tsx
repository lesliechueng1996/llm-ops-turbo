import { useLocation, useNavigate } from 'react-router';
import BadgeButtonGroup from '@/components/BadgeButtonGroup';

const menus = [
  {
    key: 'app',
    label: 'AI应用',
  },
  {
    key: 'tool',
    label: '工具',
  },
  {
    key: 'workflow',
    label: '工作流',
  },
  {
    key: 'dataset',
    label: '知识库',
  },
];

const SpaceMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeKey = pathname.split('/').pop() ?? 'app';

  const handleChange = (key: string) => {
    navigate(`/space/${key}`);
  };

  return (
    <BadgeButtonGroup
      badges={menus}
      activeKey={activeKey}
      onChange={handleChange}
    />
  );
};

export default SpaceMenu;
