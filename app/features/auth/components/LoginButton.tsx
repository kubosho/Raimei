import { useCallback } from 'react';
import type { MouseEvent } from 'react';

interface Props {
  onClick: () => void;
}

export default function LoginButton({ onClick }: Props) {
  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      onClick();
    },
    [onClick],
  );

  return (
    <button type="button" className="border-2 border-yellow-500 px-4 py-1 rounded text-slate-900" onClick={handleClick}>
      Login
    </button>
  );
}
