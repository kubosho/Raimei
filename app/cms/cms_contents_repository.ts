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
  contentsId?: string;
  headers?: HeadersInit;
};

export type CmsContentsRepositoryOptions = {
  apiKey: string;
  apiUrl: string;
};

class CmsContentsRepositoryImpl implements CmsContentsRepository {
  private _options: CmsContentsRepositoryOptions;

  constructor(options: CmsContentsRepositoryOptions) {
    this._options = options;
  }

  async create(contents: EntrySchema, options: CreateCmsContentsOptions): Promise<CreateCmsContentsResponse> {
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

  async fetch(options: FetchCmsContentsOptions): Promise<GetCmsContentsListResponse> {
    const contentsId = options.contentsId == null ? '' : options.contentsId;
    const response = await fetch(`${this._options.apiUrl}${contentsId}`, {
      headers: {
        [API_KEY_HEADER]: this._options.apiKey,
        ...options.headers,
      },
      signal: options.abortSignal,
    });

    return response.json();
  }
}

export interface CmsContentsRepository {
  create(contents: EntrySchema, options: CreateCmsContentsOptions): Promise<CreateCmsContentsResponse>;
  fetch(options: FetchCmsContentsOptions): Promise<GetCmsContentsListResponse>;
}

export const createCmsContentsRepository = (options: CmsContentsRepositoryOptions): CmsContentsRepository => {
  return new CmsContentsRepositoryImpl(options);
};
