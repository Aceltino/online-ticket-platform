export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUserResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
