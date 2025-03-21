import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import useSearchKeyword from '@/hooks/useSearchKeyword';
import { Link, useParams } from 'react-router';

const DocAction = () => {
  const { id } = useParams();
  const { keyword, setKeyword } = useSearchKeyword();

  return (
    <div className="flex items-center justify-between">
      <SearchInput
        placeholder="输入关键词搜索文档"
        defaultValue={keyword}
        onConfirm={setKeyword}
      />
      <div className="flex items-center gap-3">
        <Button variant="outline" type="button">
          召回测试
        </Button>
        <Link to={`/space/dataset/${id}/document/batch`}>
          <Button>添加文件</Button>
        </Link>
      </div>
    </div>
  );
};

export default DocAction;
