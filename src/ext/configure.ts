import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { loadEnvFile } from "process";
import { ensureEnvPresent } from "./ensureEnvPresent";

// load .env.local file and .env.production/.env.development file
loadEnvFile(`${process.cwd()}/src/ext/.env.local`);
loadEnvFile(`${process.cwd()}/src/ext/.env.${process.env.NODE_ENV}`);

const featuresEnv = {
  basicAuth: ["DATABASE_URL"],
  discordOAuth: [
    "DATABASE_URL",
    "DISCORD_OAUTH_CLIENT_ID",
    "DISCORD_OAUTH_CLIENT_SECRET",
    "DISCORD_OAUTH_REDIRECT_URI",
  ],
};

// check if the required environment variables are present
const errs = Object.fromEntries(
  Object.entries(featuresEnv).reduce(
    (acc, [feature, envs]) => {
      const missing = ensureEnvPresent(envs);
      if (missing.length > 0) {
        acc.push([feature, missing]);
      }
      return acc;
    },
    [] as [string, string[]][],
  ),
);

if (Object.keys(errs).length > 0) {
  console.error("Missing environment variables for features:");
  console.error(errs);
  process.exit(1);
}

// configure prisma client
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const client = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = client;

// configure lucia
const adapter = new PrismaAdapter(client.session, client.user);
const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: DatabaseUserAttributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

// properly type the lucia instance
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// properties of user object when validating a request from a user
interface DatabaseUserAttributes {
  username: string;
}

export { client as prismaClient, lucia };
