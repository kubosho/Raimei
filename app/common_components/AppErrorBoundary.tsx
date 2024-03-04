import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
}

export default function AppErrorBoundary({ children }: Props) {
  const handleError = useCallback(() => {
    console.error('something went wrong');
  }, []);

  return (
    <ErrorBoundary fallback={<p>something went wrong...</p>} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
