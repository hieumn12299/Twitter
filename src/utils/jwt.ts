import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
import { TokenPayload } from '~/models/requests/User.requests';

config();

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object;
  privateKey: string;
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

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error);
      }
      return resolve(decoded as TokenPayload);
    });
  });
};
