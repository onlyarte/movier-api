import { Storage } from '@google-cloud/storage';
import { MultipartFile } from '@fastify/multipart';
import crypto from 'crypto';
import path from 'path';

import config from '../../config';

class StorageService {
  private cloudStorage: Storage;

  constructor() {
    this.cloudStorage = new Storage();
  }

  async upload(
    file: MultipartFile,
    path = 'uploads/',
    metadata?: Record<string, any>
  ) {
    const buffer = await file.toBuffer();
    const key = path + this.generateKey(file.filename);

    const uploadedFile = this.cloudStorage.bucket(config.bucket).file(key);
    await uploadedFile.save(buffer, {
      metadata: {
        contentType: file.mimetype,
        ...metadata,
      },
    });

    return uploadedFile.publicUrl();
  }

  private generateKey(fileName: string) {
    const extension = path.extname(fileName);
    const token = crypto.randomBytes(16).toString('hex');
    return token + extension;
  }
}

export default StorageService;
