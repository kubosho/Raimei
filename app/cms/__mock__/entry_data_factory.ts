import { Factory } from 'fishery';

import { resetMockDate, setMockDate } from '../../constants/mock_date';
import type { AutomaticGrantFields } from '../../entities/automatic_grant_fields';
import type { EntryData, EntrySchema } from '../../entities/entry_data';
import type { Image } from '../../entities/image';

export const imageFactory = Factory.define<Image>(({ sequence }) => {
  return {
    url: `https://example.com/image_${sequence}.webp`,
    width: 100,
    height: 100,
  };
});

export const categoryFactory = Factory.define<string>(({ sequence }) => {
  return `category_${sequence}`;
});

export const tagFactory = Factory.define<string>(({ sequence }) => {
  return `tag_${sequence}`;
});

export const automaticGrantFieldsFactory = Factory.define<AutomaticGrantFields>(({ sequence }) => {
  return {
    id: `id_${sequence}`,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    publishedAt: new Date().toString(),
    revisedAt: new Date().toString(),
  };
});

export const entrySchemaFactory = Factory.define<EntrySchema>(({ sequence }) => {
  return {
    title: `title_${sequence}`,
    body: `body_${sequence}`,
    slug: `slug_${sequence}`,
    excerpt: `excerpt_${sequence}`,
    heroImage: imageFactory.build(),
    categories: categoryFactory.buildList(1),
    tags: tagFactory.buildList(1),
  };
});

export const entryDataFactory = Factory.define<EntryData>(({ afterBuild }) => {
  setMockDate();
  afterBuild(() => {
    resetMockDate();
  });

  const automaticGrantFields = automaticGrantFieldsFactory.build();
  const entrySchema = entrySchemaFactory.build();

  return {
    ...automaticGrantFields,
    ...entrySchema,
  };
});
