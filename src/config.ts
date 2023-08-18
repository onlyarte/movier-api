const {
  STORAGE_BUCKET_NAME,
  PORT,
  TMDB_API_KEY,
  AUTH0_DOMAIN,
} = process.env as Record<string, string>;

const config = {
  bucket: STORAGE_BUCKET_NAME,
  port: PORT ? parseInt(PORT) : 3000,
  tmdbApiKey: TMDB_API_KEY,
  auth0Domain: AUTH0_DOMAIN,
};

export default config;
