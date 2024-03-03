import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { getByRole, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { MicroCmsDataFactory } from '../../features/publish/__mocks__/micro_cms_data_factory';
import Index from '../_index';

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('Index', () => {
  test('it have not a session, a login link will displayed', async () => {
    // Given
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader() {
          return json({ hasSession: false, microCmsData: null });
        },
      },
    ]);

    // When
    const { container } = render(<RemixStub />);

    // Then
    await waitFor(() => expect(getByRole(container, 'link', { name: 'Login' })).not.toBe(null));
  });

  test('it have a session, a logout link is displayed', async () => {
    // Given
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader() {
          return json({ hasSession: true, microCmsData: null });
        },
      },
    ]);

    // When
    const { container } = render(<RemixStub />);

    // Then
    await waitFor(() => expect(getByRole(container, 'link', { name: 'Logout' })).not.toBe(null));
  });

  test('it a session and microCMS data exist, a list of article titles is displayed', async () => {
    // Given
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader() {
          return json({
            hasSession: true,
            microCmsData: {
              contents: [
                MicroCmsDataFactory.build({
                  title: '2022年の振り返り',
                }),
              ],
            },
          });
        },
      },
    ]);

    // When
    const { container } = render(<RemixStub />);

    // Then
    await waitFor(() => expect(getByRole(container, 'link', { name: '2022年の振り返り' })).not.toBe(null));
  });
});
