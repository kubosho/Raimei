import { useAtom, useAtomValue } from 'jotai/react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';

import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import LoginButton from '../features/auth/components/LoginButton';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import { appStorageAtom } from '../storage/atoms/app_storage_atom';

function noop() {}

export default function SettingsMicroCms(): JSX.Element {
  const [microCmsClientConfig, setMicroCmsClientConfig] = useAtom(microCmsClientConfigAtom);

  const appStorage = useAtomValue(appStorageAtom);
  const session = useAtomValue(userSessionAtom);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    const endpoint = formData.get('endpoint') as string;
    const serviceId = formData.get('serviceId') as string;

    const config = { apiKey, endpoint, serviceId };
    appStorage.set('microCmsClientConfig', config);
    setMicroCmsClientConfig(config);
  };

  const loadMicroCmsClientConfig = async () => {
    const config = await appStorage.get('microCmsClientConfig');
    if (config == null) {
      return;
    }

    setMicroCmsClientConfig(config);
  };

  useEffect(() => {
    loadMicroCmsClientConfig();
  });

  return (
    <>
      <Header>{session == null ? <LoginButton onClick={noop} /> : <AccountMenu />}</Header>
      <main>
        <section className="max-w-screen-md mx-auto px-2">
          <h2 className="leading-relaxed text-3xl">Settings</h2>
          {session == null ? (
            <p>Please log in to view settings.</p>
          ) : (
            <form className="flex flex-col mt-10" onSubmit={handleFormSubmit}>
              <label htmlFor="serviceId">microCMS service ID</label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="serviceId"
                id="serviceId"
                defaultValue={microCmsClientConfig?.serviceId}
                autoCapitalize="none"
              />
              <label className="mt-10" htmlFor="endpoint">
                microCMS API Endpoint
              </label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="endpoint"
                id="endpoint"
                defaultValue={microCmsClientConfig?.endpoint}
                autoCapitalize="none"
                autoCorrect="off"
              />{' '}
              <label className="mt-10" htmlFor="apiKey">
                microCMS API key
              </label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="apiKey"
                id="apiKey"
                defaultValue={microCmsClientConfig?.apiKey}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <button type="submit" className="border-2 border-yellow-500 mt-10 px-4 py-1 rounded text-slate-900">
                Submit
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}