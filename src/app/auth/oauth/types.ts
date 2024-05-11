import { OAuthProviders } from "./constants";

export type OAuthCookieNames = {
  [K in OAuthProviders]: {
    providerId: string;
    state: string;
  };
};

export type OAuthData = {
  username: string;
};

export type OAuthErrors = Partial<Record<keyof OAuthData, string[]>>;
