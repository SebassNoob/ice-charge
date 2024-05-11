"use server";
import { z } from "zod";
import { formValidation } from "@utils/formValidation";
import { zfd } from "zod-form-data";
import { prismaClient } from "@/ext/configure";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { oAuthCookieNames } from "./constants";
import { createSession } from "@utils/createSession";

const validate = zfd.formData({
  username: zfd.text(z.string().min(3)),
});

export const submit = async (values: FormData) => {
  const v = formValidation(validate, values);

  if (!v.isValid) {
    return v.errors;
  }

  const username = v.parsedData.username;
  const userId = generateIdFromEntropySize(10);

  // get code from cookies
  const discordOAuthIdCookie = cookies().get(
    oAuthCookieNames.discord.providerId,
  );
  if (!discordOAuthIdCookie) {
    return { username: ["Invalid request"] };
  }

  // validate code

  await prismaClient.user.create({
    data: {
      id: userId,
      username,
    },
  });

  await prismaClient.oAuthAccount.create({
    data: {
      provider: "discord",
      providerId: discordOAuthIdCookie.value,
      userId,
    },
  });

  await createSession(userId);

  return v.errors;
};
