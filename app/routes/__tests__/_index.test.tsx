import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { getByRole, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { entryDataFactory } from '../../cms/__mock__/entry_data_factory';
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
          return json({
            contents: null,
            hasSession: false,
          });
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
          return json({
            contents: null,
            hasSession: true,
          });
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
    const contents = entryDataFactory.buildList(1);
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader() {
          return json({
            hasSession: true,
            contents: {
              contents,
            },
          });
        },
      },
    ]);

    // When
    const { container } = render(<RemixStub />);

    // Then
    await waitFor(() => expect(getByRole(container, 'link', { name: contents[0].title })).not.toBe(null));
  });
});
