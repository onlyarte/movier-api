import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../config';

export const EXPIRES_IN_SECONDS = 3600;

export function sign(payload: any) {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: EXPIRES_IN_SECONDS,
  });

  const expiresAt = new Date(Date.now() + EXPIRES_IN_SECONDS * 1000);

  return { token, expiresAt };
}

export function verify(token: string) {
  const payload = jwt.verify(token, config.jwtSecret);
  return payload as JwtPayload;
}
