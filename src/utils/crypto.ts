import crypto from 'crypto';

import config from '../config';

const CRYPTO_ALGORITHM = 'aes-256-cbc' as const;

export function encrypt(text: string) {
  const initVector = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    CRYPTO_ALGORITHM,
    config.cryptoKey,
    initVector
  );

  let encryptedData = cipher.update(text, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return `${initVector.toString('hex')}:${encryptedData}`;
}

export function decrypt(text: string) {
  const [initVectorHex, encrypted] = text.split(':');
  const initVector = Buffer.from(initVectorHex, 'hex');

  const decipher = crypto.createDecipheriv(
    CRYPTO_ALGORITHM,
    config.cryptoKey,
    initVector
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
