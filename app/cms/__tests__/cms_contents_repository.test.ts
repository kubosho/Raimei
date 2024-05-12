import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { entryDataFactory, entrySchemaFactory } from '../__mock__/entry_data_factory';
import { getCmsContentsListResponseFactory } from '../__mock__/get_cms_contents_list_response_factory';
import { MOCK_API_KEY } from '../__mock__/mock_cms_api_key';
import { MOCK_CMS_API_ENDPOINT, MOCK_CMS_SERVICE_ID } from '../__mock__/mock_cms_api_params';
import { getCmsApiUrl } from '../cms_api_url';
import { cmsContentsRepository, initialCmsContentsRepository } from '../cms_contents_repository';

const CMS_API_URL = getCmsApiUrl({ endpoint: MOCK_CMS_API_ENDPOINT, serviceId: MOCK_CMS_SERVICE_ID });

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CmsContentsRepository', () => {
  describe('#fetch', async () => {
    it('should fetch contents from microCMS API', async () => {
      // Given
      const contentsListResponse = getCmsContentsListResponseFactory.build();
      server.use(
        http.get(CMS_API_URL, () => {
          return HttpResponse.json(contentsListResponse);
        }),
      );

      // When
      initialCmsContentsRepository({ apiKey: MOCK_API_KEY, apiUrl: CMS_API_URL });
      const repository = cmsContentsRepository();
      const response = await repository?.fetch({});

      // Then
      expect(response).toEqual(contentsListResponse);
    });

    it('should fetch single contents from microCMS API', async () => {
      // Given
      const entryData = entryDataFactory.build();
      const contentsResponse = entryData;
      server.use(
        http.get(`${CMS_API_URL}/${entryData.id}`, () => {
          return HttpResponse.json(contentsResponse);
        }),
      );

      // When
      initialCmsContentsRepository({ apiKey: MOCK_API_KEY, apiUrl: CMS_API_URL });
      const repository = cmsContentsRepository();
      const response = await repository?.fetch({ contentsId: entryData.id });

      // Then
      expect(response).toEqual(contentsResponse);
    });
  });

  describe('#create', async () => {
    it('should create contents in microCMS', async () => {
      // Given
      const contents = entrySchemaFactory.build();
      const { id } = entryDataFactory.build();
      const createContentsResponse = { id };
      server.use(
        http.post(CMS_API_URL, () => {
          return HttpResponse.json(createContentsResponse);
        }),
      );

      // When
      initialCmsContentsRepository({ apiKey: MOCK_API_KEY, apiUrl: CMS_API_URL });
      const repository = cmsContentsRepository();
      const response = await repository?.create(contents, {});

      // Then
      expect(response).toEqual(createContentsResponse);
    });
  });
});