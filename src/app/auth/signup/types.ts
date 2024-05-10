


export interface SignupData {
  username: string;
  password: string;
  repeatPassword: string;
}

export type SignupErrors = Record<keyof SignupData, string[]>;