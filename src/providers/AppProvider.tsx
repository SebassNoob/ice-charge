import { MantineProvider } from "@mantine/core";
import { type ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <MantineProvider>{children}</MantineProvider>;
};
