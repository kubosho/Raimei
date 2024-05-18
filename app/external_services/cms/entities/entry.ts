import type { AutomaticGrantFields } from './microcms/automatic_grant_fields';
import type { Image } from './microcms/image';

export type EntryApiFields = {
  title: string;
  body: string;
  excerpt?: string;
  heroImage?: Image;

  // metadata
  slug: string;
  categories?: string[] | null;
  tags?: string[] | null;
};

export type Entry = AutomaticGrantFields & EntryApiFields;
