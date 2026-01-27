import { UserRole } from '../../domain/enums/user-role.enum';

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}


export interface ITokenManager {
  generate(payload: TokenPayload): Promise<TokenPair>;
  verify(token: string): Promise<TokenPayload>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
}
