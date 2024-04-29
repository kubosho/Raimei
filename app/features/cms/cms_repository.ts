import type { EntryData } from '../../entities/entry_data';

import { API_KEY_HEADER } from './api_key_header';

export type GetCmsContentsListResponse = {
  contents: EntryData[];
  totalCount: number;
  offset: number;
  limit: number;
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
  fetchContents(options: FetchCmsContentsOptions): Promise<GetCmsContentsListResponse>;
}

export const createCmsRepository = (options: CmsRepositoryOptions): CmsRepository => {
  return new CmsRepositoryImpl(options);
};
