export type Configuration = {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
};

export type RawSearch = {
  page: number;
  results: Array<{
    id: number;
    // ...
  }>;
  total_results: number;
  total_pages: number;
};

export type RawMovie = {
  id: number;
  imdb_id: string | null;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string;
  production_countries: Array<{
    name: string;
  }>;
  genres: Array<{
    name: string;
  }>;
  vote_average: number;
  video?: boolean;
};

export type RawCredits = {
  cast: Array<{
    name: string;
  }>;
  crew: Array<{
    name: string;
    department: 'Directing' | 'Writing' | 'Art' | 'Production';
  }>;
};

export type RawVideos = {
  results: {
    type: string;
    site: string;
    key: string;
    official: boolean;
  }[];
};

export type RawProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type RawProviders = {
  id: number;
  results: Record<
    string,
    {
      flatrate: RawProvider[];
      rent: RawProvider[];
      buy: RawProvider[];
    }
  >[];
};

export type ParsedProvider = {
  id: number;
  providerName: string;
  providerLogoUrl: string;
};

export type ParsedProviders = {
  id: number;
  flatrate: ParsedProvider[];
  rent: ParsedProvider[];
  buy: ParsedProvider[];
};

export type ParsedMovie = {
  tmdbId: number;
  imdbId?: string | null;
  title: string;
  description?: string | null;
  poster?: string | null;
  year?: number | null;
  countries: string[];
  genres: string[];
  directors: string[];
  writers: string[];
  stars: string[];
  rating?: number | null;
  trailerUrl?: string | null;
};
