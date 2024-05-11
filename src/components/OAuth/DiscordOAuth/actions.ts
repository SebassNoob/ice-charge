"use server";
import { generateState } from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { discord } from "./utils";

export const discordSignin = async () => {
  const state = generateState();

  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });

  cookies().set("discord_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return redirect(url.toString());
};
