"use client";

import { Title, Text, Button, TextInput } from "@mantine/core";
import { submit } from "./actions";
import { useSubmit } from "@hooks/useSubmit";
import { useState } from "react";
import { OAuthErrors } from "./types";

export default function OAuthPage() {
  const [errs, setErrs] = useState<OAuthErrors>({});
  const [isPending, handleSubmit] = useSubmit(async (fd: FormData) => {
    const errs = await submit(fd);
    setErrs(errs);
  });
  return (
    <div>
      <Title order={1}>Choose a username</Title>
      <Text>Choose a username to continue</Text>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          placeholder="Enter a username"
          name="username"
          required
          error={errs.username}
        />
        <Button type="submit" loading={isPending}>
          Continue
        </Button>
      </form>
    </div>
  );
}
