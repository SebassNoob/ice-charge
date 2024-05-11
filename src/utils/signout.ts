"use server";

import { lucia } from "@/ext/configure";
import { cookies } from "next/headers";
import { validateRequest } from "@utils/validateRequest";

interface SignoutResult {
  success: boolean;
  error?: string;
}

export async function signout(): Promise<SignoutResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      success: false,
      error: "You are not signed in",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return {
    success: true,
  };
}
