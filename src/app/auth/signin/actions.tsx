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

  const user = await prismaClient.user.findUnique({
    where: {
      username: v.parsedData.username,
    },
  });

  if (!user) {
    v.errors["username"] = ["Username or password is incorrect"];
    v.errors["password"] = ["Username or password is incorrect"];
    return v.errors;
  }

  const hashed = await hash("sha256", v.parsedData.password);
  if (hashed !== user.passwordHash) {
    v.errors["username"] = ["Username or password is incorrect"];
    v.errors["password"] = ["Username or password is incorrect"];
    return v.errors;
  }

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
