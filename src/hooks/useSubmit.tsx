import { useTransition } from "react";

type UseSubmitProps = (formData: FormData) => Promise<void>;

/**
 * A custom hook for handling form submissions with a transition state.
 *
 * @param {UseSubmitProps} cb - The callback function to be called with the form data when the form is submitted.
 * This function should return a Promise that resolves when the submission is complete.
 *
 * @returns {Array} An array of two elements:
 * - `isPending`: A boolean indicating whether the form submission is currently in progress.
 * - `handleSubmit`: A function that should be used as the onSubmit handler for the form. This function will call the provided callback with the form data and manage the transition state.
 *
 * @example
 * const [isPending, handleSubmit] = useSubmit(async (formData) => {
 *   // Handle form submission by giving it to a server action...
 * });
 */
export function useSubmit(cb: UseSubmitProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.target as HTMLFormElement);
      await cb(formData);
    });
  };

  return [isPending, handleSubmit] as const;
}
