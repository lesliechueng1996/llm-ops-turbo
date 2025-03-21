import { del, get, patch, post } from '@/lib/http';
import {
  CreateDatasetReq,
  UpdateDatasetReq,
  GetDatasetPaginationReq,
  GetDatasetPaginationRes,
  GetDatasetRes,
} from '@repo/lib-api-schema';

export const createDataset = (data: CreateDatasetReq) =>
  post('/dataset', {
    body: data,
  });

export const updateDataset = (id: string, data: UpdateDatasetReq) =>
  patch(`/dataset/${id}`, {
    body: data,
  });

export const deleteDataset = (id: string) => del(`/dataset/${id}`);

export const getDataset = (id: string) => get<GetDatasetRes>(`/dataset/${id}`);

export const getDatasetPagination = (
  params: Omit<GetDatasetPaginationReq, 'pageSize'>,
) =>
  get<GetDatasetPaginationRes>('/dataset', {
    query: {
      ...params,
      pageSize: 10,
    },
  });
