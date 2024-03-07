import { kvsMemoryStorage } from '@kvs/memorystorage';
import { cleanup, getByRole, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';

import type { EditorStorageSchema } from '../../../../local_storage/editor_storage_schema.client';
import Editor from '../Editor';

function noop() {}

afterEach(cleanup);

describe('Editor', () => {
  describe('Title', () => {
    test('a label is associated with an input', () => {
      // When
      const { getByLabelText } = render(<Editor title="" body="" onChangeTitle={noop} onChangeBody={noop} />);

      // Then
      expect(getByLabelText('Entry title')).toHaveAttribute('id', 'entry-title');
    });

    test('input a text is saved to storage', async () => {
      // Given
      const inputText = 'My new title' as const;
      const storageKey = 'editorState' as const;

      const user = userEvent.setup();
      const storage = await kvsMemoryStorage<EditorStorageSchema>({
        name: 'RaimeiEditor',
        version: 1,
      });
      const onChangeTitle = (value: string) => {
        storage.set(storageKey, { title: value, body: '' });
      };
      const { container } = render(<Editor title="" body="" onChangeTitle={onChangeTitle} onChangeBody={noop} />);
      const titleInput = getByRole(container, 'textbox', { name: 'Entry title' });

      // When
      await user.click(titleInput);
      await user.type(titleInput, inputText);

      // Then
      expect((await storage.get(storageKey))?.title).toBe(inputText);
    });
  });
});
