import { PaginationReq, SuccessPaginationResponse } from '@repo/lib-api-schema';

export const calculatePagination = (query: PaginationReq) => {
  const { pageSize, currentPage } = query;
  const offset = (currentPage - 1) * pageSize;
  const limit = pageSize;
  return {
    param: { skip: offset, take: limit },
    buildResult: <T>(
      list: T[],
      total: number,
    ): SuccessPaginationResponse<T>['data'] => {
      return {
        paginator: {
          total,
          currentPage,
          pageSize,
          totalPage: Math.ceil(total / pageSize),
        },
        list,
      };
    },
  };
};
