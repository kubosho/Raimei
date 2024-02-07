import { Outlet } from '@remix-run/react';

import Header from '../features/navigation/Header';

export default function AuthRoute() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
