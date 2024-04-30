import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { entryDataFactory, entrySchemaFactory } from '../__mock__/entry_data_factory';
import { getCmsContentsListResponseFactory } from '../__mock__/get_cms_contents_list_response_factory';
import { MOCK_API_KEY } from '../__mock__/mock_cms_api_key';
import { MOCK_CMS_API_ENDPOINT, MOCK_CMS_SERVICE_ID } from '../__mock__/mock_cms_api_params';
import { getCmsApiUrl } from '../cms_api_url';
import { createCmsRepository } from '../cms_repository';

const CMS_API_URL = getCmsApiUrl({ endpoint: MOCK_CMS_API_ENDPOINT, serviceId: MOCK_CMS_SERVICE_ID });

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CmsRepository', () => {
  describe('fetchContents', async () => {
    it('should fetch contents from microCMS API', async () => {
      // Given
      const cmsRepository = createCmsRepository({ apiKey: MOCK_API_KEY, apiUrl: CMS_API_URL });
      const contentsListResponse = getCmsContentsListResponseFactory.build();
      server.use(
        http.get(CMS_API_URL, () => {
          return HttpResponse.json(contentsListResponse);
        }),
      );

      // When
      const response = await cmsRepository.fetchContents({});

      // Then
      expect(response).toEqual(contentsListResponse);
    });
  });

  describe('createContents', async () => {
    it('should create contents in microCMS', async () => {
      // Given
      const cmsRepository = createCmsRepository({ apiKey: MOCK_API_KEY, apiUrl: CMS_API_URL });
      const contents = entrySchemaFactory.build();
      const { id } = entryDataFactory.build();
      const createContentsResponse = { id };
      server.use(
        http.post(CMS_API_URL, () => {
          return HttpResponse.json(createContentsResponse);
        }),
      );

      // When
      const response = await cmsRepository.createContents(contents, {});

      // Then
      expect(response).toEqual(createContentsResponse);
    });
  });
});
