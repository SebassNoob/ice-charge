"use client";
import { Title, Text, TextInput, Button } from "@mantine/core";
import { AppSubmitButton } from "@components/AppSubmitButton";
import { useState } from "react";
import { useSubmit } from "@hooks/useSubmit";
import { notifications } from "@mantine/notifications";
import { redirect } from "next/navigation";
import { submit } from "./actions";

import { type SignupErrors } from "./types";

const errors: SignupErrors = {};

export default function SignUpPage() {
  const [errs, setErrs] = useState(errors);

  const submitCb = async (formData: FormData) => {
    const errs = await submit(formData);
    console.log(errs);
    if (!Object.values(errs).every((v) => v.length === 0)) {
      setErrs(errs);
      return;
    }
    notifications.show({
      title: "Sign up successful",
      message: "You have successfully signed up",
      color: "green",
    });
    redirect("/");
  };

  const [isPending, handleSubmit] = useSubmit(submitCb);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Title order={1}>Sign Up</Title>
        <Text>Sign up to access the best features</Text>
        <TextInput
          label="Username"
          name="username"
          required
          error={errs.username?.join(" and ")}
        />
        <TextInput
          label="Password"
          name="password"
          required
          error={errs.password?.join(" and ")}
        />
        <TextInput
          label="Repeat Password"
          name="repeatPassword"
          required
          error={errs.repeatPassword?.join(" and ")}
        />

        <Button type="submit" loading={isPending}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
