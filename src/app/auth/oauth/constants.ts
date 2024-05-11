import { OAuthCookieNames } from "./types";

export enum OAuthProviders {
  discord = "discord",
}

export const oAuthCookieNames: OAuthCookieNames = {
  discord: {
    providerId: "discord_oauth_id",
    state: "discord_oauth_state",
  },
};
