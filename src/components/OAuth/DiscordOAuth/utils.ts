import { Discord } from "arctic";

const env = {
  clientId: process.env.DISCORD_OAUTH_CLIENT_ID as string,
  clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
  redirectUri: process.env.DISCORD_OAUTH_REDIRECT_URI as string,
};

export const discord = new Discord(
  env.clientId,
  env.clientSecret,
  env.redirectUri,
);
