import jwt, { Secret, SignOptions } from 'jsonwebtoken';

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
