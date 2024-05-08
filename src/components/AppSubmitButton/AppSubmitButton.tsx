"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@mantine/core";
import { AppSubmitButtonProps } from "./types";

export function AppSubmitButton({ buttonProps }: AppSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...buttonProps}>
      Submit
    </Button>
  );
}
