export interface SignupData {
  username: string;
  password: string;
  repeatPassword: string;
}

export type SignupErrors = Partial<Record<keyof SignupData, string[]>>;
