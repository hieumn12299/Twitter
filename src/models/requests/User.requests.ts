import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserVerifyStatus } from '~/constants/enums';

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  verify: UserVerifyStatus;
}

export interface LogoutReqBody {
  refresh_token: string;
}

export interface RefreshTokenReqBody {
  refresh_token: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  password: string;
  confirm_password: string;
  forgot_password_token: string;
}

export interface UpdateMeReqBody {
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}
