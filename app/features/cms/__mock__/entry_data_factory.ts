import { Factory } from 'fishery';

import { resetMockDate, setMockDate } from '../../../constants/mock_date';
import type { EntryData } from '../../../entities/entry_data';

export const entryDataFactory = Factory.define<EntryData>(({ sequence, afterBuild }) => {
  setMockDate();
  afterBuild(() => {
    resetMockDate();
  });

  return {
    id: `entry_${sequence}`,
    title: `title_${sequence}`,
    body: `body_${sequence}`,
    slug: `slug_${sequence}`,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    publishedAt: new Date().toString(),
    revisedAt: new Date().toString(),
  };
});
