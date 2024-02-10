import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { createClient } from 'microcms-js-sdk';

import LoginButton from '../features/auth/components/LoginButton';
import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import { bodyValueAsMarkdownAtom } from '../features/editor/atoms/body_value_as_markdown_atom';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import SubmitButton from '../features/editor/components/SubmitButton';
import TextEditor from '../features/editor/components/TextEditor';
import TitleEditor from '../features/editor/components/TitleEditor';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { microCmsClientAtom } from '../features/publish/atoms/micro_cms_client_atom';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import { appStorageAtom } from '../storage/atoms/app_storage_atom';
import { useCallback, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const navigate = useNavigate();

  const appStorage = useAtomValue(appStorageAtom);
  const bodyValueAsMarkdown = useAtomValue(bodyValueAsMarkdownAtom);
  const titleValue = useAtomValue(titleValueAtom);
  const microCmsClient = useAtomValue(microCmsClientAtom);
  const microCmsClientConfig = useAtomValue(microCmsClientConfigAtom);
  const session = useAtomValue(userSessionAtom);

  const setMicroCmsClient = useSetAtom(microCmsClientAtom);
  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);

  const createMicroCmsClient = useCallback(async () => {
    const config = microCmsClientConfig ?? (await appStorage.get('microCmsClientConfig'));
    if (config == null) {
      return;
    }

    if (microCmsClientConfig == null) {
      setMicroCmsClientConfig(config);
    }

    const client = createClient({
      apiKey: config.apiKey,
      serviceDomain: config.serviceId,
    });

    setMicroCmsClient(client);
  }, [appStorage, microCmsClientConfig, setMicroCmsClient, setMicroCmsClientConfig]);

  const handleClickLoginButton = () => {
    navigate({ pathname: '/auth/login' });
  };

  const handleClickSubmitButton = () => {
    if (microCmsClientConfig == null || microCmsClient == null) {
      return;
    }

    microCmsClient.create({
      endpoint: microCmsClientConfig.endpoint,
      content: {
        title: titleValue,
        content: bodyValueAsMarkdown,
      },
    });
  };

  useEffect(() => {
    createMicroCmsClient();
  }, [createMicroCmsClient]);

  return (
    <>
      <Header>{session == null ? <LoginButton onClick={handleClickLoginButton} /> : <AccountMenu />}</Header>
      <main className="grid grid-rows-[auto_1fr]">
        <div className="max-w-screen-md mx-auto px-2 w-full">
          <TitleEditor />
        </div>
        <div className="max-w-screen-md mt-10 mx-auto px-2 w-full">
          <TextEditor />
        </div>
        <div className="max-w-screen-md mt-10 mx-auto w-full">
          <SubmitButton onClick={handleClickSubmitButton} />
        </div>
      </main>
    </>
  );
}
