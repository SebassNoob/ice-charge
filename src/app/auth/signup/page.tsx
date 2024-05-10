"use client";
import { Title, Text, TextInput, Button } from "@mantine/core";
import { AppSubmitButton } from "@components/AppSubmitButton";
import { useFormState } from "react-dom";
import { submit } from "./actions";
import { type SignupErrors } from "./types";

const errors: SignupErrors = {
  username: [],
  password: [],
  repeatPassword: [],
};


export default function SignUpPage() {
  const [errs, action] = useFormState(submit, errors);

  return (
    <div>
      <form
        action={action}
      >
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

        <AppSubmitButton>Sign Up</AppSubmitButton>
      </form>
      <Button onClick={() => console.log(errs)}>Log errors</Button>
    </div>
  );
}
