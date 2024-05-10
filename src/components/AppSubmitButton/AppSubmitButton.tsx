"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@mantine/core";
import { AppSubmitButtonProps } from "./types";

export function AppSubmitButton({
  buttonProps,
  children,
}: AppSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={pending} {...buttonProps}>
      {children ?? "Submit"}
    </Button>
  );
}
