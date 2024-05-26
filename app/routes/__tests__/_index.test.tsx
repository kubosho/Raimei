import { createRemixStub } from '@remix-run/testing';
import { getByRole, render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

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
      },
    ]);

    // When
    const { container } = render(<RemixStub />);

    // Then
    await waitFor(() => expect(getByRole(container, 'link', { name: 'Login' })).not.toBe(null));
  });
});
