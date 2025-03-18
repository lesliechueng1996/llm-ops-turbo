import { get } from '@/lib/http';
import {
  GenerateCredentialReq,
  GenerateCredentialRes,
} from '@repo/lib-api-schema';

export const generateUploadCredential = async (query: GenerateCredentialReq) =>
  get<GenerateCredentialRes>('/upload-file/credential', {
    query,
  });
