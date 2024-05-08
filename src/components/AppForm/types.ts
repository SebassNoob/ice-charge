import { type ReactNode } from "react";
import { type FormValidtionResult } from "@utils/formValidation";

export interface AppFormProps {
  children: ReactNode;
  initialErrors: FormValidtionResult["errors"];
  action: (
    prevErrors: unknown,
    formData: FormData,
  ) => FormValidtionResult["errors"] | void;
  setErrors: (errors: FormValidtionResult["errors"]) => void;
}
