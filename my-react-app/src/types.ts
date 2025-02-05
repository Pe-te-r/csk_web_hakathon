
export interface RegisterRequest {
  first_name: string;
  email: string;
  password: string;
  username: string;
}

export interface RegisterSuccessResponse {
  message: string;
}

export interface RegisterErrorResponse {
  message: string;
  error?: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;