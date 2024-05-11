"use server";
import { formValidation } from "@utils/formValidation";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hash } from "crypto";
import { generateIdFromEntropySize } from "lucia";
import { prismaClient } from "@/ext/configure";
import { Prisma } from "@prisma/client";
import { createSession } from "@utils/createSession";

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

export const submit = async (values: FormData) => {
  const v = formValidation(validate, values);

  if (!v.isValid) {
    return v.errors;
  }

  const passwordHash = await hash("sha256", v.parsedData.password);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  try {
    await prismaClient.user.create({
      data: {
        id: userId,
        username: v.parsedData.username,
      },
    });
    await prismaClient.passwordAccount.create({
      data: {
        userId: userId,
        passwordHash: passwordHash,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        v.errors["username"] = ["Username already exists"];
      }
    }
    return v.errors;
  }

  await createSession(userId);

  revalidatePath("/");

  return v.errors;
};
