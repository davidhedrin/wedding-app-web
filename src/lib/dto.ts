export type DtoSignIn = {
  email: string;
  password: string;
};

export type DtoSignUp = {
  fullname: string;
  email: string;
  password: string;
};

export type DtoOtpVerify = {
  token: string;
  otp: string;
};

export type DtoResetPassword = {
  token: string;
  password: string;
}