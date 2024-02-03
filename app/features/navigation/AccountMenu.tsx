import { useAtomValue } from 'jotai/react';

import { userSessionAtom } from '../auth/atoms/user_session_atom';
import LogoutButton from '../auth/components/LogoutButton';

export default function AccountMenu() {
  const session = useAtomValue(userSessionAtom);

  if (session == null) {
    return <></>;
  }

  return (
    <div>
      <LogoutButton onClick={() => {}} />
    </div>
  );
}
