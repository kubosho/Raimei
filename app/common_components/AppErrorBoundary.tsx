import { useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function AppErrorBoundary() {
  const handleError = useCallback(() => {
    console.error('something went wrong');
  }, []);

  return <ErrorBoundary fallback={<p>something went wrong...</p>} onError={handleError} />;
}
