import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
import { TokenPayload } from '~/models/requests/User.requests';

config();

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as Secret,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object;
  privateKey?: Secret;
  options?: SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error);
      }
      return resolve(token as string);
    });
  });
};

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as Secret
}: {
  token: string;
  secretOrPublicKey?: Secret;
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error);
      }
      return resolve(decoded as TokenPayload);
    });
  });
};
