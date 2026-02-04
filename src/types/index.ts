// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres: number[];
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  likes: boolean;
  replies: boolean;
  newReleases: boolean;
  system: boolean;
}

// Authentication Types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

// Movie Types (TMDB API)
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  adult: boolean;
  genreIds: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  productionCompanies?: ProductionCompany[];
  spokenLanguages?: Language[];
  credits?: Credits;
  videos?: VideoResult;
  similar?: MovieListResponse;
  reviews?: ReviewListResponse;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface Language {
  iso_639_1: string;
  name: string;
  englishName: string;
}

// Credits Types
export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

// Video Types
export interface VideoResult {
  results: Video[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: User;
  movieId: number;
  rating: number;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isSpoiler: boolean;
  replies?: ReviewReply[];
  status: 'published' | 'pending' | 'rejected';
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  user: User;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  parentReplyId?: string;
  replies?: ReviewReply[];
}

export interface ReviewListResponse {
  page: number;
  results: Review[];
  totalPages: number;
  totalResults: number;
}

export interface CreateReviewData {
  movieId: number;
  rating: number;
  title: string;
  content: string;
  isSpoiler: boolean;
}

// Watchlist Types
export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  movie?: Movie;
  addedAt: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

// Favorite Types
export interface FavoriteItem {
  id: string;
  userId: string;
  movieId: number;
  movie?: Movie;
  addedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'reply' | 'new_release' | 'system' | 'follow';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

// Report Types
export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  targetType: 'review' | 'reply' | 'user';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  genres?: number[];
  year?: number;
  yearRange?: { from: number; to: number };
  rating?: { min: number; max: number };
  sortBy?: 'popularity' | 'release_date' | 'vote_average' | 'title';
  sortOrder?: 'asc' | 'desc';
  type?: 'movie' | 'tv' | 'anime';
}

export interface SearchResult {
  movies: MovieListResponse;
  totalResults: number;
  query: string;
  filters: SearchFilters;
}

// Analytics Types
export interface UserAnalytics {
  totalReviews: number;
  totalLikes: number;
  totalReplies: number;
  averageRating: number;
  favoriteGenres: { genre: Genre; count: number }[];
  reviewsThisMonth: number;
  streak: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalReviews: number;
  totalMovies: number;
  newUsersToday: number;
  newReviewsToday: number;
  pendingReports: number;
  activeUsers: number;
  topReviewers: { user: User; reviewCount: number }[];
  popularMovies: { movie: Movie; reviewCount: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}
