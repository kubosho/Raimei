import type { Entry, EntryApiFields } from './entities/entry';

const API_KEY_HEADER = 'X-MICROCMS-API-KEY';

export type CmsContentsCreateOptions = {
  abortSignal?: AbortSignal;
  contentsId?: string;
  headers?: HeadersInit;
};

export type CmsContentsGetOptions = {
  abortSignal?: AbortSignal;
  contentsId?: string;
  headers?: HeadersInit;
};

export type CmsContentsRepositoryOptions = {
  apiKey: string;
  apiUrl: string;
};

export type CmsContentsCreateResponse = {
  id: string;
};

export type CmsContentsGetResponse = {
  contents: Entry[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type CmsSingleContentsGetResponse = Entry;

type CmsContentsResponse<T extends CmsContentsGetOptions> = T['contentsId'] extends string | undefined
  ? CmsSingleContentsGetResponse
  : CmsContentsGetResponse;
export interface CmsContentsRepository {
  create(contents: EntryApiFields, options: CmsContentsCreateOptions): Promise<CmsContentsCreateResponse>;
  get<Options extends CmsContentsGetOptions>(options: Options): Promise<CmsContentsResponse<Options>>;
}

class CmsContentsRepositoryImpl implements CmsContentsRepository {
  private _options: CmsContentsRepositoryOptions;

  constructor(options: CmsContentsRepositoryOptions) {
    this._options = options;
  }

  async create(contents: EntryApiFields, options: CmsContentsCreateOptions): Promise<CmsContentsCreateResponse> {
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

  async get<Options extends CmsContentsGetOptions>(options: Options): Promise<CmsContentsResponse<Options>> {
    const contentsId = options.contentsId == null ? '' : options.contentsId;
    const response = await fetch(`${this._options.apiUrl}/${contentsId}`, {
      headers: {
        [API_KEY_HEADER]: this._options.apiKey,
        ...options.headers,
      },
      signal: options.abortSignal,
    });

    return response.json();
  }
}

export const createCmsContentsRepository = (options: CmsContentsRepositoryOptions): CmsContentsRepository =>
  new CmsContentsRepositoryImpl(options);
