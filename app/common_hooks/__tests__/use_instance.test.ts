import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useInstance } from '../use_instance';

class TestClass {
  constructor() {}
}

function testFunction() {}

describe('useInstance', () => {
  test('can be pass a function to argument', () => {
    // Given
    const { result } = renderHook(() => useInstance(testFunction));

    // Then
    expect(result.current).toEqual(testFunction());
  });

  test('return the same instance object for every render', () => {
    // Given
    const { result, rerender } = renderHook(() => useInstance(new TestClass()));
    const initialResult = result.current;

    // When
    rerender();

    // Then
    expect(result.current).toEqual(initialResult);
  });
});
