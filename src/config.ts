const { STORAGE_BUCKET_NAME, PORT, HOST, TMDB_API_KEY } = process.env as Record<
  string,
  string
>;

const config = {
  bucket: STORAGE_BUCKET_NAME,
  tmdbApiKey: TMDB_API_KEY,
  port: PORT ? parseInt(PORT) : 3000,
  host: HOST || 'localhost',
};

export default config;
