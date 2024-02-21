import { kvsMemoryStorage } from '@kvs/memorystorage';
import { cleanup, getByRole, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';

import type { EditorStorageSchema } from '../../../../local_storage/editor_storage_schema';
import TitleEditor from '../TitleEditor';

afterEach(cleanup);

describe('TitleEditor', () => {
  test('renders the title editor', () => {
    // Given
    const storage = null;

    // When
    const { getByLabelText } = render(<TitleEditor storage={storage} />);

    // Then
    expect(getByLabelText('Entry title')).not.toBeNull();
  });

  test('a label is associated with an input', () => {
    // Given
    const storage = null;

    // When
    const { getByLabelText } = render(<TitleEditor storage={storage} />);

    // Then
    expect(getByLabelText('Entry title')).toHaveAttribute('id', 'entry-title');
  });

  test('input a text is saved to storage', async () => {
    // Given
    const user = userEvent.setup();
    const inputText = 'My new title';

    const storage = await kvsMemoryStorage<EditorStorageSchema>({
      name: 'RaimeiEditor',
      version: 1,
    });
    const { container } = render(<TitleEditor storage={storage} />);
    const input = getByRole(container, 'textbox');

    // When
    await user.click(input);
    await user.type(input, inputText);

    // Then
    expect(await storage.get('titleEditorState')).toBe(inputText);
  });
});
