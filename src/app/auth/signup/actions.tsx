"use server";
import { formValidation } from "@utils/formValidation";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { hash } from "crypto";
import { generateIdFromEntropySize } from "lucia";
import { type SignupErrors } from "./types";
import { prismaClient, lucia } from "@/ext/configure";

const validate = zfd
  .formData({
    username: zfd.text(z.string().min(3)),
    password: zfd.text(z.string().min(6)),
    repeatPassword: zfd.text(z.string().min(6)),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export const submit = async (_: SignupErrors, values: FormData) => {
  const v = formValidation(validate, values);
  
  if (!v.isValid) {
    return v.errors;
  }

  const passwordHash = await hash("sha256", v.parsedData.password);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  await prismaClient.user.create({
    data: {
      id: userId,
      username: v.parsedData.username,
      passwordHash: passwordHash,
    },
  });


  
  
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  
  return v.errors;
};
