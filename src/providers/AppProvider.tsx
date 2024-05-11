import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { type ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider>
      <Notifications />
      {children}
    </MantineProvider>
  );
};
