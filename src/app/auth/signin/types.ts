export interface SigninData {
  username: string;
  password: string;
}

export type SigninErrors = Partial<Record<keyof SigninData, string[]>>;
