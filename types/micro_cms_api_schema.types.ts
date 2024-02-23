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
  categories: string[] | undefined;
  tags: string[] | undefined;
  excerpt: string | undefined;
  heroImage: Image | undefined;
};
