import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Ellipsis } from 'lucide-react';

type Props = {
  id: string;
  icon: string;
  name: string;
  description: string;
  documentCount: number;
  characterCount: number;
  relatedAppCount: number;
  updatedAt: number;
  avatar: string;
  accountName: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const DatasetCard = ({
  id,
  icon,
  name,
  description,
  documentCount,
  characterCount,
  relatedAppCount,
  updatedAt,
  avatar,
  accountName,
  onEdit,
  onDelete,
}: Props) => {
  const subTitle = `${documentCount}文档 · ${Math.round(characterCount / 1000)}千字符 · ${relatedAppCount}关联应用`;
  const updateMsg = `最近编辑 ${format(new Date(updatedAt), 'MM-dd HH:mm')}`;

  const action = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onEdit(id)}>编辑</DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-700 focus:text-red-900"
          onClick={() => onDelete(id)}
        >
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return (
    <Card
      href={`/space/dataset/${id}/document`}
      iconUrl={icon}
      title={name}
      subTitle={subTitle}
      content={description}
      avatarUrl={avatar}
      name={accountName}
      footerText={updateMsg}
      action={action}
    />
  );
};
export default DatasetCard;
