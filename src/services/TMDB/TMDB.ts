import axios, { AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {
  Configuration,
  ParsedMovie,
  RawCredits,
  RawMovie,
  RawSearch,
} from './types';

const BASE_URL = 'https://api.themoviedb.org/3';

class TheMovieDBService {
  private apiKey: string;
  private configuration: Configuration | null;
  private api: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.configuration = null;

    this.api = axios.create({
      baseURL: BASE_URL,
      adapter: setupCache({
        maxAge: 15 * 60 * 1000,
      }).adapter,
    });
  }

  async init() {
    const response = await this.api.get(
      `/configuration?api_key=${this.apiKey}`
    );
    this.configuration = response.data as Configuration;
  }

  private async makePoster(path: string | null) {
    if (!path) {
      return null;
    }
    if (!this.configuration) {
      await this.init();
    }
    const { base_url, poster_sizes } = this.configuration!.images;
    return base_url + poster_sizes[poster_sizes.length - 1] + path;
  }

  private async parse(rawMovie: RawMovie, credits: RawCredits) {
    return {
      tmdbId: rawMovie.id,
      imdbId: rawMovie.imdb_id,
      title: rawMovie.title,
      description: rawMovie.overview,
      poster: await this.makePoster(rawMovie.poster_path),
      year: parseInt(rawMovie.release_date.split('-')?.[0]),
      countries: rawMovie.production_countries.map((one) => one.name),
      genres: rawMovie.genres.map((one) => one.name),
      rating: Math.round(rawMovie.vote_average),
      writers: credits.crew
        .filter((one) => one.department === 'Writing')
        .map((one) => one.name),
      directors: credits.crew
        .filter((one) => one.department === 'Directing')
        .map((one) => one.name),
      stars: credits.cast.slice(0, 5).map((one) => one.name),
    } as ParsedMovie;
  }

  async get(id: number) {
    const response = await this.api.get(
      `/movie/${id}?language=en-US&api_key=${this.apiKey}`
    );

    const creditsResponse = await this.api.get(
      `/movie/${id}/credits?language=en-US&api_key=${this.apiKey}`
    );

    const rawMovie = response.data as RawMovie;
    const credits = creditsResponse.data as RawCredits;
    console.log(credits);

    const parsed = await this.parse(rawMovie, credits);
    console.log(parsed);

    return this.parse(rawMovie, credits);
  }

  async search(query: string) {
    const safeQuery = encodeURIComponent(query);
    const response = await this.api.get(
      `/search/movie?query=${safeQuery}&language=en-US&page=1&include_adult=true&api_key=${this.apiKey}`
    );
    const { results } = response.data as RawSearch;
    return Promise.all(results.map((one) => this.get(one.id)));
  }
}

export default TheMovieDBService;
