type Params = {
  endpoint: string;
  serviceId: string;
};

const CMS_API_VERSION = 'v1' as const;
const CMS_DOMAIN = 'microcms.io' as const;

export function getCmsApiUrl({ endpoint, serviceId }: Params): string {
  const protocol = 'https://';
  const hostname = `${serviceId}.${CMS_DOMAIN}`;
  const path = `/api/${CMS_API_VERSION}/${endpoint}`;

  return `${protocol}${hostname}${path}`;
}
