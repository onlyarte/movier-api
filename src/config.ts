const {
  STORAGE_BUCKET_NAME,
  PORT,
  TMDB_API_KEY,
} = process.env as Record<string, string>;

const config = {
  bucket: STORAGE_BUCKET_NAME,
  port: PORT ? parseInt(PORT) : 3000,
  tmdbApiKey: TMDB_API_KEY,
};

export default config;
