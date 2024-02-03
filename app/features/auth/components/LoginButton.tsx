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
    <button type="button" onClick={handleClick}>
      Login
    </button>
  );
}
