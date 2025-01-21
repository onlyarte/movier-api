import axios, { AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import {
  Configuration,
  ParsedMovie,
  RawCredits,
  RawMovie,
  RawProvider,
  RawProviders,
  RawSearch,
  RawVideos,
} from './types';

const BASE_URL = 'https://api.themoviedb.org/3';

class TheMovieDBService {
  private apiKey: string;
  private configuration: Configuration | null;
  private api: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.configuration = null;

    const axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
    this.api = setupCache(axiosInstance);

    this.init().catch((e) => console.log(e));
  }

  private async init() {
    const response = await this.api.get(
      `/configuration?api_key=${this.apiKey}`
    );
    this.configuration = response.data as Configuration;
  }

  private parsePoster(path: string | null) {
    if (!path) return null;
    const { base_url, poster_sizes } = this.configuration!.images;
    return base_url + poster_sizes[poster_sizes.length - 1] + path;
  }

  private findTrailer(videos?: RawVideos) {
    const trailer = videos?.results.find(
      ({ site, type, official }) =>
        site === 'YouTube' && type === 'Trailer' && official
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : undefined;
  }

  private parse(rawMovie: RawMovie, credits?: RawCredits, videos?: RawVideos) {
    return {
      tmdbId: rawMovie.id,
      imdbId: rawMovie.imdb_id,
      title: rawMovie.title,
      description: rawMovie.overview,
      poster: this.parsePoster(rawMovie.poster_path),
      year: rawMovie.release_date
        ? parseInt(rawMovie.release_date.split('-')?.[0])
        : undefined,
      countries: rawMovie.production_countries.map((one) => one.name),
      genres: rawMovie.genres.map((one) => one.name),
      rating: Math.round(rawMovie.vote_average),
      writers: (credits?.crew ?? [])
        .filter((one) => one.department === 'Writing')
        .map((one) => one.name),
      directors: (credits?.crew ?? [])
        .filter((one) => one.department === 'Directing')
        .map((one) => one.name),
      stars: (credits?.cast ?? []).slice(0, 5).map((one) => one.name),
      trailerUrl: this.findTrailer(videos),
    } as ParsedMovie;
  }

  async get(id: number) {
    const response = await this.api.get(
      `/movie/${id}?language=en-US&api_key=${this.apiKey}`
    );
    const rawMovie = response.data as RawMovie;

    const creditsResponse = await this.api.get(
      `/movie/${id}/credits?language=en-US&api_key=${this.apiKey}`
    );
    const credits = creditsResponse.data as RawCredits;

    const videosResponse = await this.api.get(
      `/movie/${id}/videos?language=en-US&api_key=${this.apiKey}`
    );
    const videos = videosResponse.data as RawVideos;

    return this.parse(rawMovie, credits, videos);
  }

  private parseProvider(provider: RawProvider) {
    const { base_url } = this.configuration!.images;
    return {
      id: provider.provider_id,
      providerName: provider.provider_name,
      providerLogoUrl: base_url + 'w300' + provider.logo_path,
    };
  }

  async getProviders(id: number, region: string) {
    const response = await this.api.get(
      `/movie/${id}/watch/providers?language=en-US&api_key=${this.apiKey}`
    );
    const providers = response.data as RawProviders;
    // @ts-ignore
    if (!providers.results[region]) return null;

    // @ts-ignore
    const { flatrate, rent, buy } = providers.results[region];

    return {
      id: providers.id,
      flatrate: flatrate?.map((entry: RawProvider) =>
        this.parseProvider(entry)
      ),
      rent: rent?.map((entry: RawProvider) => this.parseProvider(entry)),
      buy: buy?.map((entry: RawProvider) => this.parseProvider(entry)),
    };
  }

  async search(query: string, year?: number) {
    const safeQuery = encodeURIComponent(query);
    let path = `/search/movie?query=${safeQuery}&page=1&api_key=${this.apiKey}`;
    if (year) {
      path += `&primary_release_year=${year}`;
    }
    const response = await this.api.get(path);
    const { results } = response.data as RawSearch;
    return Promise.all(
      results.map((one) =>
        this.parse({
          ...one,
          imdb_id: null,
          production_countries: [],
          genres: [],
        })
      )
    );
  }

  async findByExternalId(id: string, source = 'imdb_id') {
    const response = await this.api.get(
      `/find/${id}?external_source=${source}&language=en-US&api_key=${this.apiKey}`
    );
    const { movie_results: results } = response.data as {
      movie_results: { id: number }[];
    };

    if (results.length) {
      return this.get(results[0].id);
    }
    return null;
  }

  async *findAll(generator: AsyncGenerator<{ title: string; year: number }>) {
    for await (const { title, year } of generator) {
      try {
        const matches = await this.search(title, year);
        if (matches[0]) yield { id: matches[0].tmdbId, ...matches[0] };
      } catch {
        // ignore
      }
    }
  }
}

export default TheMovieDBService;
