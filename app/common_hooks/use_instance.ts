import { useRef } from 'react';

export function useInstance<T>(instance: T): T {
  const ref = useRef<T>(instance);

  if (typeof instance === 'function') {
    ref.current = instance();
  } else {
    ref.current = instance;
  }

  return ref.current;
}
