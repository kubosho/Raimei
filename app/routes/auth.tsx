import { Outlet } from '@remix-run/react';

import { ThunderSvg } from '../assets/components/ThunderSvg';

export default function AuthRoute() {
  return (
    <>
      <header className="flex justify-between max-w-screen-md mx-auto">
        <h1 className="items-center flex text-gray-900">
          <ThunderSvg alt="" className="fill-yellow-500 h-4 w-4" />
          <span className="ml-1">Raimei</span>
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
