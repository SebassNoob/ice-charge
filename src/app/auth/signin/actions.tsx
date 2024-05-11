"use server";
import { formValidation } from "@utils/formValidation";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { hash } from "crypto";
import { prismaClient, lucia } from "@/ext/configure";

const validate = zfd.formData({
  username: zfd.text(z.string().min(3)),
  password: zfd.text(z.string().min(6)),
});

export const submit = async (values: FormData) => {
  const v = formValidation(validate, values);

  if (!v.isValid) {
    return v.errors;
  }

  const incorrectUserOrPassError = {
    username: ["Username or password is incorrect"],
    password: ["Username or password is incorrect"],
  };

  const user = await prismaClient.user.findUnique({
    where: {
      username: v.parsedData.username,
    },
    include: {
      passwordAccount: true,
    },
  });

  if (!user) return incorrectUserOrPassError;

  const hashed = await hash("sha256", v.parsedData.password);

  // user did not sign up with password so recommend them to use oauth
  if (!user.passwordAccount)
    return {
      password: [
        "You did not sign up with this method. Try signing in your OAuth provider",
      ],
    };

  if (hashed !== user.passwordAccount.passwordHash)
    return incorrectUserOrPassError;

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  revalidatePath("/");

  return v.errors;
};
