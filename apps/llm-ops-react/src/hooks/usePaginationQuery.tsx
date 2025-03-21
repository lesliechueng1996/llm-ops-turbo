import { getDatasetPagination } from '@/apis/dataset';
import { useEffect } from 'react';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { useInfiniteQuery } from '@tanstack/react-query';
import useSearchKeyword from '@/hooks/useSearchKeyword';
import { SuccessPaginationResponse } from '@repo/lib-api-schema';
import LoadMoreComponent from '@/components/LoadMore';

type FetchFnParams = {
  currentPage: number;
  searchWord: string;
};

type Props<T> = {
  fetchFn: (params: FetchFnParams) => Promise<SuccessPaginationResponse<T>>;
  queryKey: string;
};

const usePaginationQuery = <T,>({ fetchFn, queryKey }: Props<T>) => {
  const { keyword } = useSearchKeyword();

  const { data, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKey, keyword],
    queryFn: ({ pageParam }) =>
      fetchFn({
        currentPage: pageParam,
        searchWord: keyword,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.paginator.currentPage === lastPage.data.paginator.totalPage
        ? undefined
        : lastPage.data.paginator.currentPage + 1,
  });

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error, '获取知识库失败'));
    }
  }, [error]);

  const list = data?.pages.flatMap((page) => page.data.list) ?? [];

  const LoadMore = hasNextPage && (
    <LoadMoreComponent onLoadMore={fetchNextPage} />
  );

  return {
    list,
    LoadMore,
  };
};

export default usePaginationQuery;
