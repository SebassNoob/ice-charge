export const dynamic = "force-dynamic";
import { z } from "zod";
import { cookies } from "next/headers";
import { prismaClient } from "@/ext/configure";
import { createSession } from "@utils/createSession";
import type { DiscordSigninCallbackData } from "./types";
import { oAuthCookieNames } from "../constants";
import { revalidatePath } from "next/cache";
import { discord } from "@components/OAuth";

const validate = z.object({
  code: z.string(),
  state: z.string(),
});

const provider = "discord";
const { state: discordOAuthStateCookie, providerId: discordOAuthIdCookie } =
  oAuthCookieNames.discord;

// defaults to auto
export async function GET(request: Request): Promise<Response> {
  // grab the query params
  const { searchParams } = new URL(request.url);
  const [searchParamCode, searchParamState] = [
    searchParams.get("code"),
    searchParams.get("state"),
  ];

  const v = validate.safeParse({
    code: searchParamCode,
    state: searchParamState,
  });
  if (!v.success) {
    return new Response("Invalid query parameters", { status: 400 });
  }

  const { code, state } = v.data satisfies DiscordSigninCallbackData;
  const discord_oauth_state = cookies().get(discordOAuthStateCookie)?.value;
  if (state !== discord_oauth_state) {
    return new Response("Invalid state", { status: 400 });
  }

  // check if user exists

  const tokens = await discord.validateAuthorizationCode(code);
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const user = await response.json();
  const account = await prismaClient.oAuthAccount.findFirst({
    where: {
      provider: provider,
      providerId: user.id,
    },
    include: {
      user: true,
    },
  });

  // remove the state cookie
  cookies().set(discordOAuthStateCookie, "", { expires: new Date(0) });

  if (account) {
    await createSession(account.userId);

    revalidatePath("/");

    // redirect to home page
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } else {
    // account does not exist yet, redirect to /auth/oauth
    // set a new cookie with the providerId
    cookies().set(discordOAuthIdCookie, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/auth/oauth?provider=${provider}`,
      },
    });
  }
}
