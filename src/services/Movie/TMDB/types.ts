import { Movie as PrismaMovie } from '@prisma/client';

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
    title: string;
    overview: string | null;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    video?: boolean;
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

export type Provider = {
  id: number;
  providerName: string;
  providerLogoUrl: string;
};

export type Providers = {
  id: number;
  flatrate: Provider[];
  rent: Provider[];
  buy: Provider[];
};

export type Movie = Omit<
  PrismaMovie,
  'id' | 'listIds' | 'recommendedForListIds'
>;
