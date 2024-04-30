import { Factory } from 'fishery';

import type { GetCmsContentsListResponse } from '../cms_repository';
import { entryDataFactory } from './entry_data_factory';

export const getCmsContentsListResponseFactory = Factory.define<GetCmsContentsListResponse>(() => ({
  contents: entryDataFactory.buildList(1),
  totalCount: 1,
  offset: 0,
  limit: 1,
}));
