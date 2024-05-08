import { z, type ZodTypeAny } from "zod";

export interface FormValidtionResult {
  isValid: boolean;
  parsedData?: Record<string, ZodTypeAny>;
  errors: Record<string, string[] | undefined> | {};
}

export function formValidation<T extends Record<string, ZodTypeAny>>(
  schema: z.ZodObject<T>,
  data: FormData,
): FormValidtionResult {
  const res = schema.safeParse(data);
  return {
    isValid: res.success,
    parsedData: res.data,
    errors: res.error?.flatten().fieldErrors ?? {},
  };
}
