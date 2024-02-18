import type { Session } from "@supabase/supabase-js";
import { Factory } from "fishery";

import { UserFactory } from "./user_factory";

export const SessionFactory = Factory.define<Session>(() => ({
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    refresh_token: "Y3RmcG9zQmFzZTY0VGVzdFRva2VuS2V5XzEyMzQ1Njc4OV9xMjM0NXRnZg==",
    expires_in: 3600,
    token_type: '',
    user: UserFactory.build(),
}));
