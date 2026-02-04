import type { Movie, MovieListResponse, Genre, Credits, VideoResult, SearchFilters } from '../types';

// TMDB API configuration
const TMDB_API_KEY = import.meta.env.TMDB_API_KEY || '3fd2be6f0c70a2a598f084ddfb75487c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

// Fetch helper function
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'id-ID',
    ...params
  });
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json();
}

// Helper function to get image URL
export function getImageUrl(
  path: string | null,
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!path) {
    return type === 'profile' 
      ? '/images/default-avatar.png' 
      : '/images/default-poster.png';
  }
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
}

// Transform TMDB movie response to our Movie type
function transformMovie(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title || movie.name,
    originalTitle: movie.original_title || movie.original_name,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date || movie.first_air_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    adult: movie.adult,
    genreIds: movie.genre_ids || [],
    genres: movie.genres,
    runtime: movie.runtime || movie.episode_run_time?.[0],
    status: movie.status,
    tagline: movie.tagline,
    budget: movie.budget,
    revenue: movie.revenue,
    productionCompanies: movie.production_companies?.map((c: any) => ({
      id: c.id,
      name: c.name,
      logoPath: c.logo_path,
      originCountry: c.origin_country,
    })),
    spokenLanguages: movie.spoken_languages?.map((l: any) => ({
      iso_639_1: l.iso_639_1,
      name: l.name,
      englishName: l.english_name,
    })),
  };
}

// Transform movie list response
function transformMovieList(response: any): MovieListResponse {
  return {
    page: response.page,
    results: response.results.map(transformMovie),
    totalPages: response.total_pages,
    totalResults: response.total_results,
  };
}

// ========== MOVIE ENDPOINTS ==========

// Get trending movies
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>(`/trending/movie/${timeWindow}`, { page: String(page) });
  return transformMovieList(response);
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/movie/popular', { page: String(page) });
  return transformMovieList(response);
}

// Get top rated movies
export async function getTopRatedMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/movie/top_rated', { page: String(page) });
  return transformMovieList(response);
}

// Get now playing movies (Sedang Tayang)
export async function getNowPlayingMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/movie/now_playing', { page: String(page) });
  return transformMovieList(response);
}

// Get upcoming movies
export async function getUpcomingMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/movie/upcoming', { page: String(page) });
  return transformMovieList(response);
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<Movie> {
  const response = await tmdbFetch<any>(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
  
  const movie = transformMovie(response);
  
  // Add credits
  if (response.credits) {
    movie.credits = {
      cast: response.credits.cast.map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
        order: c.order,
      })),
      crew: response.credits.crew.map((c: any) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profilePath: c.profile_path,
      })),
    };
  }
  
  // Add videos
  if (response.videos) {
    movie.videos = {
      results: response.videos.results.map((v: any) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
    };
  }
  
  // Add similar movies
  if (response.similar) {
    movie.similar = transformMovieList(response.similar);
  }
  
  return movie;
}

// Get movie credits
export async function getMovieCredits(movieId: number): Promise<Credits> {
  const response = await tmdbFetch<any>(`/movie/${movieId}/credits`);
  return {
    cast: response.cast.map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
      order: c.order,
    })),
    crew: response.crew.map((c: any) => ({
      id: c.id,
      name: c.name,
      job: c.job,
      department: c.department,
      profilePath: c.profile_path,
    })),
  };
}

// Get movie videos (trailers)
export async function getMovieVideos(movieId: number): Promise<VideoResult> {
  const response = await tmdbFetch<any>(`/movie/${movieId}/videos`);
  return {
    results: response.results.map((v: any) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official,
    })),
  };
}

// Get similar movies
export async function getSimilarMovies(movieId: number, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>(`/movie/${movieId}/similar`, { page: String(page) });
  return transformMovieList(response);
}

// Get recommended movies
export async function getRecommendedMovies(movieId: number, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>(`/movie/${movieId}/recommendations`, { page: String(page) });
  return transformMovieList(response);
}

// ========== TV/SERIES ENDPOINTS ==========

// Get popular TV series
export async function getPopularTVSeries(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/tv/popular', { page: String(page) });
  return transformMovieList(response);
}

// Get top rated TV series
export async function getTopRatedTVSeries(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/tv/top_rated', { page: String(page) });
  return transformMovieList(response);
}

// Get TV series on the air
export async function getOnTheAirTVSeries(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/tv/on_the_air', { page: String(page) });
  return transformMovieList(response);
}

// Get TV series details
export async function getTVSeriesDetails(seriesId: number): Promise<Movie> {
  const response = await tmdbFetch<any>(`/tv/${seriesId}`, {
    append_to_response: 'credits,videos,similar',
  });
  return transformMovie(response);
}

// ========== ANIME ENDPOINTS ==========

// Get anime (using animation genre filter with Japanese origin)
export async function getAnimeMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/discover/movie', {
    page: String(page),
    with_genres: '16', // Animation genre
    with_original_language: 'ja', // Japanese
    sort_by: 'popularity.desc',
  });
  return transformMovieList(response);
}

export async function getAnimeSeries(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/discover/tv', {
    page: String(page),
    with_genres: '16', // Animation genre
    with_original_language: 'ja', // Japanese
    sort_by: 'popularity.desc',
  });
  return transformMovieList(response);
}

// ========== GENRE ENDPOINTS ==========

// Get all movie genres
export async function getMovieGenres(): Promise<Genre[]> {
  const response = await tmdbFetch<any>('/genre/movie/list');
  return response.genres;
}

// Get all TV genres
export async function getTVGenres(): Promise<Genre[]> {
  const response = await tmdbFetch<any>('/genre/tv/list');
  return response.genres;
}

// Get movies by genre
export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/discover/movie', {
    page: String(page),
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
  });
  return transformMovieList(response);
}

// ========== SEARCH ENDPOINTS ==========

// Search movies
export async function searchMovies(query: string, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/search/movie', { query, page: String(page) });
  return transformMovieList(response);
}

// Search TV series
export async function searchTVSeries(query: string, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbFetch<any>('/search/tv', { query, page: String(page) });
  return transformMovieList(response);
}

// Multi search (movies, TV, people)
export async function multiSearch(query: string, page: number = 1): Promise<any> {
  const response = await tmdbFetch<any>('/search/multi', { query, page: String(page) });
  return response;
}

// Advanced search with filters
export async function advancedSearch(filters: SearchFilters, page: number = 1): Promise<MovieListResponse> {
  const params: Record<string, string> = { page: String(page) };
  
  if (filters.query) {
    // Use search endpoint for query
    return searchMovies(filters.query, page);
  }
  
  // Use discover endpoint for filters
  if (filters.genres?.length) {
    params.with_genres = filters.genres.join(',');
  }
  
  if (filters.year) {
    params.primary_release_year = String(filters.year);
  }
  
  if (filters.yearRange) {
    params['primary_release_date.gte'] = `${filters.yearRange.from}-01-01`;
    params['primary_release_date.lte'] = `${filters.yearRange.to}-12-31`;
  }
  
  if (filters.rating) {
    params['vote_average.gte'] = String(filters.rating.min);
    params['vote_average.lte'] = String(filters.rating.max);
  }
  
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder || 'desc';
    params.sort_by = `${filters.sortBy}.${sortOrder}`;
  }
  
  const endpoint = filters.type === 'tv' ? '/discover/tv' : '/discover/movie';
  const response = await tmdbFetch<any>(endpoint, params);
  return transformMovieList(response);
}

// ========== PERSON ENDPOINTS ==========

// Get person details
export async function getPersonDetails(personId: number): Promise<any> {
  const response = await tmdbFetch<any>(`/person/${personId}`, {
    append_to_response: 'movie_credits,tv_credits',
  });
  return response;
}

// Search people
export async function searchPeople(query: string, page: number = 1): Promise<any> {
  const response = await tmdbFetch<any>('/search/person', { query, page: String(page) });
  return response;
}

export default {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getRecommendedMovies,
  getPopularTVSeries,
  getTopRatedTVSeries,
  getOnTheAirTVSeries,
  getTVSeriesDetails,
  getAnimeMovies,
  getAnimeSeries,
  getMovieGenres,
  getTVGenres,
  getMoviesByGenre,
  searchMovies,
  searchTVSeries,
  multiSearch,
  advancedSearch,
  getPersonDetails,
  searchPeople,
  getImageUrl,
};
