export interface DiscordSigninCallbackData {
  code: string;
  state: string;
}

export type DiscordSigninCallbackErrors = Partial<
  Record<keyof DiscordSigninCallbackData, string[]>
>;
