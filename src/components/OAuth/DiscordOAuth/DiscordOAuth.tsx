import { Button } from "@mantine/core";
import { discordSignin } from "./actions";

export function DiscordOAuth() {
  return (
    <form action={discordSignin}>
      <Button type="submit">Sign in with Discord</Button>
    </form>
  );
}
