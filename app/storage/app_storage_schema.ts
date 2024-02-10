export type AppStorageSchema = {
  microCmsClientConfig: {
    apiKey: string;
    endpoint: string;
    serviceId: string;
    // Prevent environment variables set by another user from being entered.
    userId: string;
  };
  textEditorState: string;
  titleEditorState: string;
};
