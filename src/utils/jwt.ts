import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../config';

const JWT_EXPIRES_IN = '1 hour';

export function sign(payload: any) {
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
  return token;
}

export function verify(token: string) {
  const payload = jwt.verify(token, config.jwtSecret);
  return payload as JwtPayload;
}
