import { get, post } from '@/lib/http';
import {
  GenerateCredentialReq,
  GenerateCredentialRes,
  SaveFileRes,
} from '@repo/lib-api-schema';

export const generateUploadCredential = async (query: GenerateCredentialReq) =>
  get<GenerateCredentialRes>('/upload-file/credential', {
    query,
  });

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  // 创建新的Blob对象，保留原始文件内容但不包含文件名信息
  const blob = new Blob([file], { type: file.type });
  // 将文件添加到FormData，指定文件名
  formData.append('file', blob, file.name);

  return post<SaveFileRes>('/upload-file', {
    body: formData,
  });
};
