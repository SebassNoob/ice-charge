"use client";

import { useEffect, useActionState } from "react";
import { AppFormProps } from "./types";

export function AppForm({
  children,
  initialErrors,
  action,
  setErrors,
}: AppFormProps) {
  const [state, formAction] = useActionState(action, initialErrors);
  useEffect(() => state && setErrors(state), [state, setErrors]);

  return <form action={formAction}>{children}</form>;
}
