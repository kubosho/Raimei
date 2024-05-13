import type { AutomaticGrantFields } from './automatic_grant_fields';
import type { Image } from './image';

export type EntrySchema = {
  title: string;
  body: string;
  excerpt?: string;
  heroImage?: Image;

  // metadata
  slug: string;
  categories?: string[] | null;
  tags?: string[] | null;
};

export type EntryData = AutomaticGrantFields & EntrySchema;
