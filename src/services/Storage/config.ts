const {
  STORAGE_BUCKET_NAME,
} = process.env as Record<string, string>;

const config = {
  bucket: STORAGE_BUCKET_NAME,
};

export default config;
