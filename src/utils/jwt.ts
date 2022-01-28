import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.CRYPTO_KEY as string;
const JWT_EXPIRES_IN = '1 hour';

export function sign(payload: any) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}

export function verify(token: string) {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload as JwtPayload;
}
