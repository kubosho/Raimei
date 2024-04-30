import type { EntryData, EntrySchema } from '../entities/entry_data';

import { API_KEY_HEADER } from './api_key_header';

export type CreateCmsContentsResponse = {
  id: string;
};

export type GetCmsContentsListResponse = {
  contents: EntryData[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type CreateCmsContentsOptions = {
  abortSignal?: AbortSignal;
  contentsId?: string;
  headers?: HeadersInit;
};

export type FetchCmsContentsOptions = {
  abortSignal?: AbortSignal;
  headers?: HeadersInit;
};

export type CmsRepositoryOptions = {
  apiKey: string;
  apiUrl: string;
};

class CmsRepositoryImpl implements CmsRepository {
  private _options: CmsRepositoryOptions;

  constructor(options: CmsRepositoryOptions) {
    this._options = options;
  }

  async createContents(contents: EntrySchema, options: CreateCmsContentsOptions): Promise<CreateCmsContentsResponse> {
    const response = await fetch(this._options.apiUrl, {
      method: options.contentsId == null ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        [API_KEY_HEADER]: this._options.apiKey,
        ...options.headers,
      },
      body: JSON.stringify(contents),
      signal: options.abortSignal,
    });

    return response.json();
  }

  async fetchContents(options: FetchCmsContentsOptions): Promise<GetCmsContentsListResponse> {
    const response = await fetch(this._options.apiUrl, {
      headers: {
        [API_KEY_HEADER]: this._options.apiKey,
        ...options.headers,
      },
      signal: options.abortSignal,
    });

    return response.json();
  }
}

export interface CmsRepository {
  createContents(contents: EntrySchema, options: CreateCmsContentsOptions): Promise<CreateCmsContentsResponse>;
  fetchContents(options: FetchCmsContentsOptions): Promise<GetCmsContentsListResponse>;
}

export const createCmsRepository = (options: CmsRepositoryOptions): CmsRepository => {
  return new CmsRepositoryImpl(options);
};
