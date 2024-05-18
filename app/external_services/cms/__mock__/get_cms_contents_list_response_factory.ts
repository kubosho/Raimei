import { Factory } from 'fishery';

import type { GetCmsContentsListResponse } from '../cms_contents_repository';
import { entryFactory } from './entry_factory';

export const getCmsContentsListResponseFactory = Factory.define<GetCmsContentsListResponse>(() => ({
  contents: entryFactory.buildList(1),
  totalCount: 1,
  offset: 0,
  limit: 1,
}));
