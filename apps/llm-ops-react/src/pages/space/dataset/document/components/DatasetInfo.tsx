import { getDataset } from '@/apis/dataset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

const DatasetInfo = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ['dataset', id],
    queryFn: () => getDataset(id ?? ''),
  });

  const dataset = data?.data;

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>获取知识库详情失败</AlertDescription>
        </Alert>
      )}
      {isLoading && (
        <div className="flex items-center gap-3">
          <Link to="/space/dataset">
            <ChevronLeft className="size-4" />
          </Link>
          <Skeleton className="size-10 rounded-sm bg-background" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-20 bg-background" />
            <div className="flex items-center gap-2 text-xs">
              <Skeleton className="h-4 w-10 bg-background" />
              <Skeleton className="h-4 w-10 bg-background" />
              <Skeleton className="h-4 w-10 bg-background" />
            </div>
          </div>
        </div>
      )}
      {dataset && (
        <div className="flex items-center gap-3">
          <Link to="/space/dataset">
            <ChevronLeft className="size-4" />
          </Link>
          <img
            src={dataset.icon}
            alt={dataset.name}
            className="size-10 rounded-sm"
          />
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              知识库 / {dataset.name}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge>{dataset.documentCount} 文档</Badge>
              <Badge>{dataset.hitCount} 命中</Badge>
              <Badge>{dataset.relatedAppCount} 关联应用</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetInfo;
