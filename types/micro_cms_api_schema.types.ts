export type Image = {
  url: string;
  width: number;
  height: number;
};

export type MicroCmsApiSchema = {
  id: string;
  title: string;
  body: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  categories?: string[];
  tags?: string[];
  excerpt?: string;
  heroImage?: Image;
};
